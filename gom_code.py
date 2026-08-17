import os

# Danh sách các file Backend và Frontend cần thiết cho tính năng Import/Export JSON trong PDF
TARGET_FILES = [
    # ================= BACKEND =================
    # PDF Export Logic
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/pdf/PlaywrightCvPdfExportAdapter.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/service/CvDigitalPdfExportRunner.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/service/impl/CvDigitalPdfExportRunnerImpl.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/port/CvPdfExportPort.java",
    
    # Entity & Database
    "backend-core/domain/src/main/java/com/worklify/domain/candidate/model/CvDocument.java",
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/persistence/entity/CvDocumentJpaEntity.java",
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/persistence/adapter/CvDocumentRepositoryAdapter.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/dto/CvDocumentResponse.java",
    
    # Controller & Pom (Check Dependency)
    "backend-core/api/src/main/java/com/worklify/api/controller/candidate/CandidateController.java",
    "backend-core/infrastructure/pom.xml",
    "backend-core/api/pom.xml",

    # ================= FRONTEND =================
    "frontend-app/src/pages/candidate/CVManagerPage/index.jsx",
    "frontend-app/src/pages/candidate/CVBuilderPage/index.jsx",
    "frontend-app/src/components/cv-builder/shared/mapParsedCvToCvData.js",
    "frontend-app/src/features/candidate/candidateService.js"
]

OUTPUT_FILE = "exported_cv_json_pdf_flow.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# Codebase Context: Embed JSON into PDF & Import Flow\n\n")
        
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