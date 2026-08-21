import os

# Danh sách các file cần thiết để làm tính năng Live Preview cho form Job (Employer)
TARGET_FILES = [
    # Bắt buộc — để preview khớp với trang thật và xử lý Rich Text chuẩn xác
    "frontend-app/src/pages/public/JobDetailPage/index.jsx",
    "frontend-app/src/components/common/RichTextEditor/index.jsx",
    
    # Nên có — để đồng bộ UI và xem xét tái sử dụng thành Component chung
    "frontend-app/src/pages/employer/JobEditPage/index.jsx",
    "frontend-app/src/components/shared/JobCard/index.jsx",
    
    # Backend DTO — confirm data fields (logo, company name, requirements,...)
    "backend-core/application/src/main/java/com/worklify/application/job/dto/JobPostingResponse.java"
]

OUTPUT_FILE = "exported_job_preview_context.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# Codebase Context: Tính năng Live Preview Job (Employer)\n\n")
        
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