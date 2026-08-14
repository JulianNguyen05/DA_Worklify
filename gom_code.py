import os

TARGET_FILES = [
    # 1. CV Builder (UI & Logic)
    "frontend-app/src/pages/candidate/CVBuilderPage/index.jsx",
    "frontend-app/src/components/cv-builder/templates/cvTemplateCore.js",
    "frontend-app/src/components/cv-builder/templates/SimpleTemplate.jsx",
    "frontend-app/src/components/cv-builder/templates/ProfessionalTemplate.jsx",
    "frontend-app/src/components/cv-builder/templates/HarvardTemplate.jsx",
    "frontend-app/src/components/cv-builder/shared/captureCvDigitalPdf.js",
    "frontend-app/src/components/cv-builder/shared/captureCvThumbnail.js",

    # 2. Mapping ngược
    "frontend-app/src/components/cv-builder/shared/mapParsedCvToCvData.js",
    "frontend-app/src/components/cv-builder/shared/mapProfileToCvData.js",

    # 3. Backend (Service mới & DTO)
    "backend-core/application/src/main/java/com/worklify/application/candidate/dto/GeneratedCvRequest.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/dto/CvDocumentResponse.java",
    "backend-core/domain/src/main/java/com/worklify/domain/candidate/model/CvDocument.java",
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/persistence/entity/CvDocumentJpaEntity.java",
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/persistence/adapter/CvDocumentRepositoryAdapter.java",
    "backend-core/application/src/main/java/com/worklify/application/candidate/service/impl/CandidateServiceImpl.java",
    "backend-core/api/src/main/java/com/worklify/api/controller/candidate/CandidateController.java",
    "backend-core/application/src/main/java/com/worklify/application/common/port/FileStoragePort.java",
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/storage/LocalFileStorageService.java",
    "backend-core/api/pom.xml",
    "backend-core/pom.xml",

    # 4. Tham khảo pattern sẵn có
    "backend-core/application/src/main/java/com/worklify/application/common/port/CvParsingPort.java",
    "backend-core/infrastructure/src/main/java/com/worklify/infrastructure/client/MlCvParsingClient.java"
]

OUTPUT_FILE = "exported_cv_builder_upgrade.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# Architecture Context: Digital PDF Upgrade\n\n")
        
        for filepath in TARGET_FILES:
            append_file_content(filepath, outfile)

def append_file_content(filepath, outfile):
    if os.path.exists(filepath):
        outfile.write(f"## File: `{filepath}`\n\n")
        outfile.write("```" + get_extension(filepath) + "\n")
        try:
            with open(filepath, "r", encoding="utf-8") as infile:
                outfile.write(infile.read() + "\n")
        except Exception as e:
            outfile.write(f"// Error reading file: {e}\n")
        outfile.write("```\n\n")
    else:
        print(f"⚠️ Warning: File not found: {filepath}")

def get_extension(filepath):
    ext = filepath.split('.')[-1].lower()
    if ext in ['py']: return 'python'
    if ext in ['java']: return 'java'
    if ext in ['js', 'jsx']: return 'javascript'
    if ext in ['json']: return 'json'
    if ext in ['xml']: return 'xml'
    return 'text'

if __name__ == "__main__":
    gather_files()
    print(f"✅ Đã gom code thành công vào file: {OUTPUT_FILE}")