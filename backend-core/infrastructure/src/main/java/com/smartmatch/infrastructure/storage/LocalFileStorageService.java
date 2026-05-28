// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\storage\LocalFileStorageService.java
package com.smartmatch.infrastructure.storage;

import com.worklify.application.common.port.FileStoragePort;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;

@Slf4j
@Service
public class LocalFileStorageService implements FileStoragePort {

    @Value("${application.storage.local.upload-dir:./uploads}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
            log.info("Đã khởi tạo thư mục lưu trữ gốc tại: {}", this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Không thể khởi tạo thư mục lưu trữ. Lỗi: " + e.getMessage(), e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory, String prefix) {
        // 1. Kiểm tra file hợp lệ
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Không thể lưu file rỗng.");
        }

        // 2. Chuẩn hóa tên file và xử lý bảo mật (Chống Path Traversal)
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Tên file chứa ký tự đường dẫn không hợp lệ: " + originalFilename);
        }

        // 3. ĐỔI TÊN FILE: [prefix]_[tên_gốc]
        // Loại bỏ khoảng trắng trong tên file gốc để URL web không bị lỗi
        String safeOriginalName = originalFilename.replaceAll("\\s+", "_");
        String finalFileName = prefix + "_" + safeOriginalName;

        try {
            // 4. Xác định thư mục đích và tạo nếu chưa tồn tại
            Path targetLocation = this.rootLocation.resolve(subDirectory);
            Files.createDirectories(targetLocation);

            // 5. Lưu file vào ổ cứng (Nếu file trùng tên sẽ ghi đè bản cũ)
            Path targetFile = targetLocation.resolve(finalFileName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            log.info("Lưu file thành công: {}", targetFile);

            // 6. Trả về đường dẫn tương đối (vd: cv/5_CV_Dev.pdf) để lưu vào Database
            return subDirectory + "/" + finalFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Không thể lưu trữ file " + originalFilename + ". Lỗi: " + ex.getMessage(), ex);
        }
    }

    @Override
    public byte[] readFile(String filePath) {
        try {
            Path file = this.rootLocation.resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return Files.readAllBytes(file);
            } else {
                throw new RuntimeException("Không thể đọc file hoặc file không tồn tại: " + filePath);
            }
        } catch (IOException ex) { // Đã xóa bỏ MalformedURLException
            throw new RuntimeException("Lỗi khi đọc file: " + filePath, ex);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path file = this.rootLocation.resolve(filePath).normalize();
            Files.deleteIfExists(file);
            log.info("Đã xóa file: {}", filePath);
        } catch (IOException ex) {
            log.error("Không thể xóa file: {}", filePath, ex);
            throw new RuntimeException("Lỗi khi xóa file: " + filePath, ex);
        }
    }

    /**
     * Hàm phụ trợ lấy đuôi file (extension)
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}