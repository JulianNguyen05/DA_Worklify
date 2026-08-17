package com.worklify.infrastructure.pdf;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.WaitUntilState;
import com.worklify.application.candidate.CvPdfMarker;
import com.worklify.application.candidate.port.CvPdfExportPort;
import com.worklify.application.common.exception.CvPdfExportException;
import jakarta.annotation.PostConstruct;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSArray;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification;
import org.apache.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
import org.apache.pdfbox.pdmodel.common.PDNameTreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.*;

@Component
public class PlaywrightCvPdfExportAdapter implements CvPdfExportPort, DisposableBean {

    private static final Logger log = LoggerFactory.getLogger(PlaywrightCvPdfExportAdapter.class);

    @Value("${worklify.cv-export.print-base-url}")
    private String printBaseUrl; // vd: http://localhost:5173/cv-print

    @Value("${worklify.cv-export.render-timeout-ms:15000}")
    private long renderTimeoutMs;

    // Mỗi thread trong pool giữ Playwright/Browser riêng — bắt buộc vì API không
    // thread-safe qua nhiều thread. Tái dùng xuyên suốt, không launch Chromium mới
    // mỗi request (rất tốn, ~vài trăm ms - vài giây).
    private final ThreadLocal<BrowserHolder> browserHolder = ThreadLocal.withInitial(BrowserHolder::new);

    private final ExecutorService renderExecutor = Executors.newFixedThreadPool(2, r -> {
        Thread t = new Thread(r, "cv-pdf-export");
        t.setDaemon(true);
        return t;
    });

    @Override
    public byte[] exportDigitalPdf(String rawTextJson) {
        try {
            Future<byte[]> future = renderExecutor.submit(() -> renderAndEmbed(rawTextJson));
            return future.get(renderTimeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            throw new CvPdfExportException("Render PDF quá " + renderTimeoutMs + "ms", e);
        } catch (Exception e) {
            throw new CvPdfExportException("Không thể sinh PDF số", e);
        }
    }

    private byte[] renderAndEmbed(String rawTextJson) throws Exception {
        log.info("[cv-pdf] Bước 1: lấy/khởi tạo Browser...");
        Browser browser = browserHolder.get().browser();
        log.info("[cv-pdf] Bước 1 xong. Bước 2: mở context + navigate...");

        try (BrowserContext context = browser.newContext()) {
            Page page = context.newPage();
            page.navigate(printBaseUrl, new Page.NavigateOptions()
                    .setWaitUntil(WaitUntilState.LOAD)
                    .setTimeout(10000)); // timeout riêng cho bước này — nếu treo, ném lỗi rõ ràng thay vì im lặng
            log.info("[cv-pdf] Bước 2 xong. Bước 3: bơm cvData...");

            page.evaluate("(json) => window.__WORKLIFY_SET_CV_DATA__(JSON.parse(json))", rawTextJson);
            log.info("[cv-pdf] Bước 3 xong. Bước 4: chờ CV_READY...");

            page.waitForFunction("window.__WORKLIFY_CV_READY__ === true",
                    null, new Page.WaitForFunctionOptions().setTimeout(10000));
            log.info("[cv-pdf] Bước 4 xong. Chụp PDF...");

            byte[] rawPdf = page.pdf(new Page.PdfOptions()
                    .setFormat("A4")
                    .setPrintBackground(true)
                    .setMargin(new Margin().setTop("0").setBottom("0").setLeft("0").setRight("0")));

            log.info("[cv-pdf] Chụp xong, {} bytes. Nhúng JSON...", rawPdf.length);
            return embedCvJson(rawPdf, rawTextJson);
        }
    }
    /** Nhúng JSON gốc làm embedded file chuẩn PDF (kiểu Factur-X) + marker ở metadata. */
    private byte[] embedCvJson(byte[] rawPdf, String rawTextJson) throws IOException {
        try (PDDocument doc = Loader.loadPDF(rawPdf)) {
            PDDocumentInformation info = doc.getDocumentInformation();
            info.setKeywords(CvPdfMarker.CV_MARKER); // check nhanh không cần mở embedded file
            info.setCustomMetadataValue("WorklifySchemaVersion", "1");

            byte[] jsonBytes = rawTextJson.getBytes(StandardCharsets.UTF_8);
            PDEmbeddedFile embedded = new PDEmbeddedFile(doc, new ByteArrayInputStream(jsonBytes));
            embedded.setSubtype("application/json");
            embedded.setSize(jsonBytes.length);

            PDComplexFileSpecification fs = new PDComplexFileSpecification();
            fs.setFile(CvPdfMarker.EMBEDDED_FILE_NAME);
            fs.setEmbeddedFile(embedded);
            fs.setFileDescription("Dữ liệu CV gốc (JSON) để khôi phục vào CV Builder");

            PDEmbeddedFilesNameTreeNode efTree = new PDEmbeddedFilesNameTreeNode();
            efTree.setNames(Map.of(CvPdfMarker.EMBEDDED_FILE_NAME, fs));

            PDDocumentCatalog catalog = doc.getDocumentCatalog();
            PDDocumentNameDictionary namesDict = catalog.getNames();
            if (namesDict == null) {
                // PDF Playwright tạo ra chưa có /Names dictionary — phải tự khởi tạo
                // trước khi gắn embedded files vào, nếu không NPE đúng như log.
                namesDict = new PDDocumentNameDictionary(catalog);
                catalog.setNames(namesDict);
            }
            namesDict.setEmbeddedFiles(efTree);

            // AFRelationship=Data ở /AF của catalog (chuẩn PDF/A-3) — đánh dấu rõ đây
            // là dữ liệu đi kèm, không phải tệp đính kèm rác.
            COSArray afArray = new COSArray();
            afArray.add(fs.getCOSObject());
            doc.getDocumentCatalog().getCOSObject().setItem(COSName.getPDFName("AF"), afArray);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    private static class BrowserHolder {
        private final Playwright playwright;
        private final Browser browser;
        BrowserHolder() {
            this.playwright = Playwright.create();
            this.browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
        }
        Browser browser() { return browser; }
    }

    @Override
    public void destroy() {
        renderExecutor.shutdown();
        // Không có hook chuẩn để đóng Browser trên từng thread của ThreadLocal khi
        // shutdown — chấp nhận để JVM dọn (thread daemon), phù hợp quy mô đồ án.
    }

    @PostConstruct
    public void warmUp() {
        // Chạy trước trên cả 2 thread của pool để trả chi phí cold-start Chromium
        // (thấy trong log là ~12s/lần) ngay lúc app khởi động, không phải để
        // request lưu CV đầu tiên của người dùng phải gánh chịu.
        for (int i = 0; i < 2; i++) {
            renderExecutor.submit(() -> {
                try {
                    browserHolder.get().browser();
                    log.info("[cv-pdf] Warm-up Chromium xong trên thread {}", Thread.currentThread().getName());
                } catch (Exception e) {
                    log.warn("[cv-pdf] Warm-up Chromium thất bại: {}", e.getMessage());
                }
            });
        }
    }
}