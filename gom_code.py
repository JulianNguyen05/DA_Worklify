import os

# Danh sách các file cốt lõi cần để debug lỗi rớt dữ liệu map CV
TARGET_FILES = [
    # 1. File trung tâm xử lý mapping dữ liệu
    "frontend-app/src/components/cv-builder/shared/mapParsedCvToCvData.js",
    
    # 2. Schema gốc từ ML trả về để đối chiếu field name
    "backend-ml/app/schemas/parser_schema.py",
    
    # 3. Component chứa defaultData của template để so sánh cấu trúc
    "frontend-app/src/components/cv-builder/templates/SimpleTemplate.jsx",
    
    # 4. Nơi lấy location.state.prefillData lúc mount
    "frontend-app/src/pages/candidate/CVBuilderPage/index.jsx"
]

# Task này không cần quét toàn bộ thư mục
TARGET_DIRS = []

OUTPUT_FILE = "exported_cv_mapping_debug.md"

def gather_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# CV Data Mapping Debug Context\n\n")
        
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
    return 'text'

if __name__ == "__main__":
    gather_files()
    print(f"✅ Đã gom code thành công vào file: {OUTPUT_FILE}")