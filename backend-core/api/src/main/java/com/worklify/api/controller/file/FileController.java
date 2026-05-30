package com.worklify.api.controller.file;

import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.repository.CvDocumentRepository;
import com.worklify.infrastructure.storage.LocalFileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final CvDocumentRepository cvDocumentRepository;

    // Inject Service đọc file của bạn (Dựa vào log bạn gửi, nó là LocalFileStorageService)
    private final LocalFileStorageService fileStorageService;

    @GetMapping("/cv/{cvId}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'CANDIDATE', 'ADMIN')")
    @Operation(summary = "Đọc file CV (Dành cho Employer xem hồ sơ)")
    public ResponseEntity<byte[]> getCvFile(@PathVariable("cvId") Long cvId) {

        // 1. Tìm CV trong Database
        CvDocument cv = cvDocumentRepository.findById(cvId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin CV"));

        // 2. Chuẩn hóa đường dẫn: Loại bỏ tiền tố "/uploads/" hoặc "uploads/" nếu có trong DB
        String cleanPath = cv.getFilePath();
        if (cleanPath != null) {
            // Thay thế tất cả các tiền tố gây lỗi về dạng đường dẫn tương đối đúng (VD: "cv/11_Bản-in.pdf")
            cleanPath = cleanPath.replaceFirst("^/?uploads/", "");

            // Xóa dấu '/' ở đầu nếu vẫn còn sót lại
            if (cleanPath.startsWith("/")) {
                cleanPath = cleanPath.substring(1);
            }
        }

        // 3. Đọc file dưới dạng byte[]
        byte[] fileData = fileStorageService.readFile(cleanPath);

        // 4. Cấu hình Header để trả về file PDF cho trình duyệt
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cv.getFileName() + "\"");

        return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
    }
}