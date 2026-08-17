package com.worklify.infrastructure.pdf;

import com.worklify.application.candidate.CvPdfMarker;
import com.worklify.application.candidate.port.CvPdfImportPort;
import com.worklify.application.common.exception.CvPdfImportException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.PDDocumentNameDictionary;
import org.apache.pdfbox.pdmodel.common.PDNameTreeNode;
import org.apache.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification;
import org.apache.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class PdfBoxCvJsonExtractorAdapter implements CvPdfImportPort {

    private static final Logger log = LoggerFactory.getLogger(PdfBoxCvJsonExtractorAdapter.class);

    @Override
    public String extractEmbeddedCvJson(byte[] pdfBytes) {
        try (PDDocument doc = Loader.loadPDF(pdfBytes)) {
            // Check nhanh qua Keywords trước — tránh phải đào sâu cây embedded
            // files cho 1 PDF thường không liên quan gì tới Worklify.
            PDDocumentInformation info = doc.getDocumentInformation();
            String keywords = info != null ? info.getKeywords() : null;
            if (keywords == null || !keywords.contains(CvPdfMarker.CV_MARKER)) {
                throw new CvPdfImportException(
                        "File PDF này không phải do Worklify tạo ra (hoặc dữ liệu ẩn đã bị mất). "
                                + "Chỉ có thể khôi phục CV từ file PDF tải xuống trực tiếp từ Worklify.");
            }

            PDDocumentCatalog catalog = doc.getDocumentCatalog();
            PDDocumentNameDictionary namesDict = catalog.getNames();
            if (namesDict == null || namesDict.getEmbeddedFiles() == null) {
                throw new CvPdfImportException("Không tìm thấy dữ liệu CV ẩn bên trong file PDF này.");
            }

            PDNameTreeNode<PDComplexFileSpecification> efTree = namesDict.getEmbeddedFiles();
            Map<String, PDComplexFileSpecification> names = efTree.getNames();
            PDComplexFileSpecification fileSpec =
                    names != null ? names.get(CvPdfMarker.EMBEDDED_FILE_NAME) : null;
            if (fileSpec == null) {
                throw new CvPdfImportException(
                        "Không tìm thấy dữ liệu CV ẩn (" + CvPdfMarker.EMBEDDED_FILE_NAME + ") bên trong file PDF này.");
            }

            PDEmbeddedFile embedded = fileSpec.getEmbeddedFile();
            if (embedded == null) {
                throw new CvPdfImportException("Dữ liệu CV ẩn bên trong file PDF bị hỏng hoặc rỗng.");
            }

            try (InputStream is = embedded.createInputStream()) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                is.transferTo(out);
                String json = out.toString(StandardCharsets.UTF_8);
                log.info("[cv-pdf-import] Đọc thành công cv-data.json ({} bytes)", json.length());
                return json;
            }
        } catch (CvPdfImportException e) {
            throw e;
        } catch (IOException e) {
            throw new CvPdfImportException("Không thể đọc file PDF, file có thể bị hỏng.", e);
        }
    }
}