const fs = require('fs');
const path = require('path');

// Cấu hình đường dẫn
const sourceDir = path.join(__dirname, 'backend-core', 'domain'); 
const outputFile = path.join(__dirname, 'domain_code_extracted_by_js.txt');
const allowedExtensions = ['.java', '.xml']; // Các đuôi file muốn lấy

// Xóa file cũ nếu đã tồn tại để ghi mới
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
}

function extractCode(currentDir) {
    let items;
    try {
        items = fs.readdirSync(currentDir);
    } catch (err) {
        console.error(`Lỗi khi đọc thư mục ${currentDir}:`, err.message);
        return;
    }

    for (const item of items) {
        // Bỏ qua thư mục target
        if (item === 'target') {
            continue;
        }

        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Nếu là thư mục thì đệ quy tiếp
            extractCode(fullPath);
        } else if (stat.isFile()) {
            // Nếu là file, kiểm tra đuôi file
            const ext = path.extname(fullPath);
            if (allowedExtensions.includes(ext)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    
                    // Tạo header cho từng file để dễ đọc
                    const header = `\n// ${'='.repeat(60)}\n// File: ${fullPath.replace(__dirname, '')}\n// ${'='.repeat(60)}\n\n`;
                    
                    // Ghi nối tiếp vào file đích
                    fs.appendFileSync(outputFile, header + content + '\n');
                } catch (err) {
                    console.error(`Lỗi khi đọc file ${fullPath}:`, err.message);
                }
            }
        }
    }
}

console.log(`Đang tiến hành trích xuất code từ: ${sourceDir}...`);
extractCode(sourceDir);
console.log(`Hoàn tất! Toàn bộ code đã được lưu vào: ${outputFile}`);