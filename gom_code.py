import os

# Danh sách các file cốt lõi cần để debug pipeline ML và mapping
TARGET_FILES = [
    # Xem OCR ra text thô như thế nào
    "backend-ml/app/services/text_extractor.py",
    
    # Rule-based cho Education/Experience trước khi qua NER
    "backend-ml/app/services/rule_based_extractor.py",
    
    # Xử lý output NER
    "backend-ml/app/services/ner_postprocessor.py",
    
    # Pipeline tổng (extract → rule-based → NER)
    "backend-ml/app/services/parser_service.py",
    
    # Cấu trúc ParsedCvResponse (để biết field nào có confidence thấp)
    "backend-ml/app/schemas/parser_schema.py",
    
    # Xem model NER đang load là bản nào
    "backend-ml/app/models/model_loader.py",
    
    # Cấu hình model NER
    "backend-ml/app/models/ner_model/config.json",
    
    # File map dữ liệu ở frontend để loại trừ khả năng lỗi ở tầng map
    "frontend-app/src/components/cv-builder/shared/mapParsedCvToCvData.js"
]

# Task này không cần quét toàn bộ thư mục
TARGET_DIRS = []

# Tên file đầu ra
OUTPUT_FILE = "exported_ml_pipeline_debug.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# ML Pipeline & Frontend Mapping Debug Context\n\n")
        
        # Xử lý các file lẻ
        for filepath in TARGET_FILES:
            append_file_content(filepath, outfile)
            
        # Xử lý các thư mục (để trống nhưng giữ logic đề phòng cần dùng sau)
        for directory in TARGET_DIRS:
            if os.path.exists(directory):
                for root, _, files in os.walk(directory):
                    for file in files:
                        file_path = os.path.join(root, file)
                        append_file_content(file_path, outfile)

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
    return 'text'

if __name__ == "__main__":
    gather_files()
    print(f"✅ Đã gom code thành công vào file: {OUTPUT_FILE}")