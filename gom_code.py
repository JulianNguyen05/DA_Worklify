import os

# Danh sách các file Backend và Frontend cần thiết cho tính năng Employer xem hồ sơ Candidate
TARGET_FILES = [
    # ================= 1. FRONTEND =================
    "frontend-app/src/features/employer/employerService.js",
    "frontend-app/src/router/index.jsx",
    "frontend-app/src/components/layout/EmployerLayout/index.jsx",
    "frontend-app/src/components/layout/MainLayout/index.jsx",
    "frontend-app/src/components/layout/Navbar/index.jsx",
    "frontend-app/src/components/layout/AuthLayout/index.jsx", # Để bạn đối chiếu bảng màu chuẩn xanh dương/teal
    
    # ================= 2. BACKEND =================
    "backend-core/api/src/main/java/com/worklify/api/controller/employer/EmployerController.java",
    "backend-core/application/src/main/java/com/worklify/application/employer/service/impl/EmployerServiceImpl.java",
    "backend-core/api/src/main/java/com/worklify/api/controller/candidate/CandidateController.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/service/impl/CandidateServiceImpl.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/dto/CandidateProfileFullResponse.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/dto/CandidateProfileResponse.java",

    # ================= 3. THAM KHẢO UI =================
    "frontend-app/src/pages/candidate/ProfilePage/index.jsx",
    "frontend-app/src/pages/candidate/CVManagerPage/index.jsx" # Trang chuẩn màu để copy token, spacing, class
]

OUTPUT_FILE = "exported_employer_candidate_view.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# Codebase Context: Tính năng Employer Search & View Candidate Profile\n\n")
        
        for filepath in TARGET_FILES:
            append_file_content(filepath, outfile)

def append_file_content(filepath, outfile):
    if os.path.exists(filepath):
        outfile.write(f"## File: `{filepath}`\n\n")
        
        # Xác định extension để highlight syntax
        ext = filepath.split('.')[-1].lower()
        syntax = "java" if ext == "java" else "javascript" if ext in ["js", "jsx"] else "xml" if ext == "xml" else "text"
        
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