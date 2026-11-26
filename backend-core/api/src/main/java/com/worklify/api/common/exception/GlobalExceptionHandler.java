package com.worklify.api.common.exception;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.exception.AiServiceException;
import com.worklify.application.common.exception.CvPdfImportException;
import com.worklify.application.common.exception.ForbiddenOperationException;
import com.worklify.application.common.exception.ReferenceValueSuggestionPendingException;
import com.worklify.application.common.exception.ResourceNotFoundException; // Nhớ import file này nhé!
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 1. Bắt lỗi vi phạm quy tắc nghiệp vụ (Fail-Fast từ tầng Service/Domain)
     * Thường ném ra bằng: throw new IllegalArgumentException("Email đã tồn tại");
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Trả về HTTP Status 400 ra Network tab
    public ApiResponse<Void> handleIllegalArgumentException(IllegalArgumentException ex) {
        // Đưa trực tiếp thông điệp nghiệp vụ cụ thể vào thuộc tính 'message'
        return ApiResponse.error(400, ex.getMessage());
    }

    /**
     * 2. Bắt lỗi không tìm thấy tài nguyên (Ví dụ: Không tìm thấy doanh nghiệp cần duyệt)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // Trả về HTTP Status 404 ra Network tab
    public ApiResponse<Void> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ApiResponse.error(404, ex.getMessage());
    }

    /**
     * 3. Bắt lỗi ràng buộc dữ liệu đầu vào của các DTO (@NotBlank, @Email, @Size,...)
     * Tự động bóc tách lỗi đầu tiên làm thông điệp đại diện (Top-level message) cho React hiển thị nhanh
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Trả về HTTP Status 400 ra Network tab
    public ApiResponse<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // LinkedHashMap để lỗi đầu tiên (làm message chính) ổn định giữa các lần gọi
        Map<String, String> errors = new java.util.LinkedHashMap<>();

        // Thu thập toàn bộ danh sách các trường bị nhập lỗi
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = error instanceof FieldError fe ? fe.getField() : error.getObjectName();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Tìm kiếm lỗi đầu tiên xuất hiện để gán làm thông điệp chính ở lớp ngoài cùng
        String topLevelMessage = errors.values().stream()
                .findFirst()
                .orElse("Dữ liệu đầu vào không hợp lệ, vui lòng kiểm tra lại.");

        // Trả về cấu trúc ApiResponse chứa map chi tiết lỗi bên trong trường 'data'
        return ApiResponse.error(errors, topLevelMessage);
    }

    /**
     * 4. Bắt các lỗi hệ thống phát sinh ngoài ý muốn (NullPointerException, lỗi kết nối DB,...)
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // Trả về HTTP Status 500 ra Network tab
    public ApiResponse<Void> handleGeneralException(Exception ex) {
        // Log chi tiết ở server; không trả nội dung exception (câu SQL, tên class...) ra client
        log.error("Lỗi không mong đợi", ex);
        return ApiResponse.error(500, "Hệ thống Worklify gặp sự cố bất ngờ, vui lòng thử lại sau.");
    }

    /**
     * 4b. Lỗi do request sai định dạng: JSON hỏng, thiếu/sai kiểu tham số. Trước đây rơi vào handler chung → 500.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleNotReadable(HttpMessageNotReadableException ex) {
        return ApiResponse.error(400, "Dữ liệu gửi lên không đúng định dạng JSON hoặc sai kiểu dữ liệu.");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMissingParam(MissingServletRequestParameterException ex) {
        return ApiResponse.error(400, "Thiếu tham số bắt buộc: " + ex.getParameterName());
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMissingPart(MissingServletRequestPartException ex) {
        return ApiResponse.error(400, "Thiếu file đính kèm: " + ex.getRequestPartName());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ApiResponse.error(400, "Giá trị không hợp lệ cho tham số: " + ex.getName());
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMethodValidation(HandlerMethodValidationException ex) {
        String message = ex.getAllErrors().stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .filter(m -> m != null && !m.isBlank())
                .findFirst()
                .orElse("Dữ liệu đầu vào không hợp lệ, vui lòng kiểm tra lại.");
        return ApiResponse.error(400, message);
    }

    /** Sai trạng thái nghiệp vụ (vd chuyển trạng thái đơn sai quy trình, nộp trùng, đóng tin đã đóng). */
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleIllegalState(IllegalStateException ex) {
        return ApiResponse.error(409, ex.getMessage());
    }

    /** Vi phạm ràng buộc DB (unique...) còn lọt qua tầng service. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.warn("Vi phạm ràng buộc dữ liệu: {}", ex.getMostSpecificCause().getMessage());
        return ApiResponse.error(409, "Dữ liệu bị trùng hoặc vi phạm ràng buộc, vui lòng kiểm tra lại.");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public ApiResponse<Void> handleMaxUpload(MaxUploadSizeExceededException ex) {
        return ApiResponse.error(413, "File tải lên vượt quá dung lượng cho phép (10MB).");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleNoResource(NoResourceFoundException ex) {
        return ApiResponse.error(404, "Không tìm thấy đường dẫn: /" + ex.getResourcePath());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ApiResponse<Void> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ApiResponse.error(405, "Phương thức " + ex.getMethod() + " không được hỗ trợ cho đường dẫn này.");
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    public ApiResponse<Void> handleMediaType(HttpMediaTypeNotSupportedException ex) {
        return ApiResponse.error(415, "Định dạng nội dung (Content-Type) không được hỗ trợ.");
    }

    /**
     * 5. Bắt lỗi khi PDF người dùng upload không phải PDF số do Worklify tạo ra
     * (thiếu marker/embedded JSON) — dùng 422 vì request hợp lệ về mặt hình thức
     * (đúng là 1 file PDF), chỉ sai về mặt nội dung/nguồn gốc.
     */
    @ExceptionHandler(CvPdfImportException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY) // HTTP 422
    public ApiResponse<Void> handleCvPdfImportException(CvPdfImportException ex) {
        return ApiResponse.error(422, ex.getMessage());
    }

    /**
     * 1b. Bắt trường hợp candidate submit skill/language chưa tồn tại trong hệ thống.
     * Request đã được ghi nhận dưới dạng ReferenceValueSuggestion (PENDING), nhưng
     * hành động chính (gán skill vào hồ sơ) CHƯA xảy ra ngay — dùng 409 Conflict để
     * FE dễ xử lý qua nhánh catch lỗi chung (status >= 400) như các lỗi nghiệp vụ khác.
     */
    @ExceptionHandler(ReferenceValueSuggestionPendingException.class)
    @ResponseStatus(HttpStatus.CONFLICT) // HTTP 409
    public ApiResponse<Void> handleReferenceValueSuggestionPendingException(ReferenceValueSuggestionPendingException ex) {
        return ApiResponse.error(409, ex.getMessage());
    }

    /**
     * 6. Dịch vụ AI (backend-ml) tắt hoặc trả lỗi — dùng 503 để FE hiện thông báo "thử lại sau"
     * thay vì lỗi hệ thống chung.
     */
    @ExceptionHandler(AiServiceException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE) // HTTP 503
    public ApiResponse<Void> handleAiServiceException(AiServiceException ex) {
        return ApiResponse.error(503, ex.getMessage());
    }

    /**
     * 7. Đã đăng nhập nhưng không có quyền trên tài nguyên (vd xem ứng viên của công ty khác).
     */
    @ExceptionHandler(ForbiddenOperationException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN) // HTTP 403
    public ApiResponse<Void> handleForbiddenOperationException(ForbiddenOperationException ex) {
        return ApiResponse.error(403, ex.getMessage());
    }

    /**
     * 8. @PreAuthorize từ chối (sai vai trò). Nếu không bắt riêng, lỗi này rơi vào handler Exception chung
     * ở trên và bị trả nhầm thành HTTP 500.
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN) // HTTP 403
    public ApiResponse<Void> handleAccessDeniedException(AccessDeniedException ex) {
        return ApiResponse.error(403, "Bạn không có quyền thực hiện thao tác này.");
    }
}