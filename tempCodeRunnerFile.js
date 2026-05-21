const fs = require('fs');
const path = require('path');

// Cấu hình đường dẫn cho phân hệ APPLICATION
const sourceDir = path.join(__dirname, 'backend-core', 'application'); 
const outputFile = path.join(__dirname, 'application_code_extracted_by_js.txt');
const allowedExtensions = ['.java', '.xml']; // Các định dạng file muốn gộp

// Xóa file kết quả cũ nếu đã tồn tại từ trước để làm mới dữ liệu
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
}

function extractApplicationCode(currentDir) {
    let items;
    try {
        items = fs.readdirSync(currentDir);
    } catch (err) {
        console.error(`Lỗi khi đọc thư mục ${currentDir}:`, err.message);
        return;
    }

    for (const item of items) {
        // Chủ động bỏ qua thư mục build 'target' của Maven nhằm tối ưu dung lượng file đầu ra
        if (item === 'target') {
            continue;
        }

        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Biện pháp đệ quy đào sâu vào các lớp package con (dto, service,...)
            extractApplicationCode(fullPath);
        } else if (stat.isFile()) {
            // Tiến hành kiểm tra phần mở rộng của tệp tin
            const ext = path.extname(fullPath);
            if (allowedExtensions.includes(ext)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    
                    // Kiến tạo Header phân tách rõ ràng để AI hoặc lập trình viên dễ theo dõi
                    const header = `\n// ${'='.repeat(60)}\n// File: ${fullPath.replace(__dirname, '')}\n// ${'='.repeat(60)}\n\n`;
                    
                    // Ghi nối tiếp nội dung mã nguồn vào file txt tổng hợp
                    fs.appendFileSync(outputFile, header + content + '\n');
                } catch (err) {
                    console.error(`Lỗi khi đọc tệp tin ${fullPath}:`, err.message);
                }
            }
        }
    }
}

console.log(`[START] Đang tiến hành trích xuất mã nguồn Application từ: ${sourceDir}...`);
extractApplicationCode(sourceDir);
console.log(`[SUCCESS] Hoàn tất! Toàn bộ mã nguồn Application đã được lưu vào: ${outputFile}`);