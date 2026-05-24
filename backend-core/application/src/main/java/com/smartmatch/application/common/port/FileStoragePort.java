// File: \backend-core\application\src\main\java\com\smartmatch\application\common\port\FileStoragePort.java
package com.smartmatch.application.common.port;

import org.springframework.web.multipart.MultipartFile;

public interface FileStoragePort {
    /**
     * Lưu trữ file và trả về đường dẫn/tên file đã lưu.
     * @param file File tải lên từ client
     * @param subDirectory Thư mục con (vd: "cv", "avatars", "logos")
     * @return Đường dẫn tương đối hoặc URL để truy cập file
     */
    String storeFile(MultipartFile file, String subDirectory, String prefix);

    /**
     * Lấy dữ liệu file dưới dạng mảng byte
     */
    byte[] readFile(String filePath);

    /**
     * Xóa file khỏi hệ thống
     */
    void deleteFile(String filePath);
}