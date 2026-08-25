import os

# Danh sách các file Backend và Frontend cần thiết để truy vết lỗi import CV PDF
TARGET_FILES = [
    # --- BACKEND ---
    # endpoint import-digital-pdf để xem cách bắt exception
    "backend-core/api/src/main/java/com/worklify/api/controller/candidate/CandidateController.java",
    
    # chỗ log "yêu cầu khôi phục CV từ file PDF số" và logic gọi extractor
    "backend-core/application/src/main/java/com/worklify/application/candidate/service/impl/CandidateServiceImpl.java",
    
    # nơi thực sự parse JSON ẩn trong PDF, chắc chắn đang throw exception khi không tìm thấy marker
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/pdf/PdfBoxCvJsonExtractorAdapter.java",
    
    # exception class, xem có ErrorCode/message cụ thể không
    "backend-core/application/src/main/java/com/worklify/application/common/exception/CvPdfImportException.java",
    
    # map exception → response 422, xem body trả về có field phân biệt được "not a worklify pdf" với các lỗi 422 khác không
    "backend-core/api/src/main/java/com/worklify/api/common/exception/GlobalExceptionHandler.java",
    
    # enum các mã lỗi hiện có
    "backend-core/api/src/main/java/com/worklify/api/common/exception/ErrorCode.java",
    
    # --- FRONTEND ---
    # File chứa handleUploadFileChange (CVTemplatesPage)
    "frontend-app/src/pages/candidate/CVTemplatesPage/index.jsx",
    
    # File chứa handleUploadFileChange (CVManagerPage)
    "frontend-app/src/pages/candidate/CVManagerPage/index.jsx",
    
    # hàm importDigitalPdf gọi API
    "frontend-app/src/features/candidate/candidateService.js"
]

OUTPUT_FILE = "exported_cv_import_error_context.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# Codebase Context: Trace CV PDF Import Exception\n\n")
        
        for filepath in TARGET_FILES:
            append_file_content(filepath, outfile)

def append_file_content(filepath, outfile):
    if os.path.exists(filepath):
        outfile.write(f"## File: `{filepath}`\n\n")
        
        # Xác định extension để highlight syntax
        ext = filepath.split('.')[-1].lower()
        syntax = "java" if ext == "java" else "javascript" if ext in ["js", "jsx"] else "text"
        
        outfile.write(f"```{syntax}\n")
        try:
            with open(filepath, "r", encoding="utf-8") as infile:
                outfile.write(infile.read() + "\n")
        except Exception as e:
            outfile.write(f"// Error reading file: {e}\n")
        outfile.write("```\n\n")
    else:
        print(f"⚠️ Warning: File not found: {filepath}")

if __name__ == "__main__":
    gather_files()
    print(f"✅ Đã gom code thành công vào file: {OUTPUT_FILE}")