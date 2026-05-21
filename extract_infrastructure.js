const fs = require('fs');
const path = require('path');

// ===============================================
// Cấu hình đường dẫn cho phân hệ INFRASTRUCTURE
// ===============================================
const sourceDir = path.join(__dirname, 'backend-core', 'infrastructure');

const outputFile = path.join(
    __dirname,
    'infrastructure_code_extracted_by_js.txt'
);

// Các định dạng file muốn gom lại
const allowedExtensions = ['.java', '.xml', '.yml', '.yaml', '.properties'];

// ===============================================
// Xóa file cũ nếu tồn tại
// ===============================================
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
}

// ===============================================
// Hàm đệ quy quét mã nguồn Infrastructure
// ===============================================
function extractInfrastructureCode(currentDir) {

    let items;

    try {
        items = fs.readdirSync(currentDir);
    } catch (err) {
        console.error(
            `Lỗi khi đọc thư mục ${currentDir}:`,
            err.message
        );
        return;
    }

    for (const item of items) {

        // =======================================
        // Bỏ qua thư mục build/cache không cần thiết
        // =======================================
        if (
            item === 'target' ||
            item === '.idea' ||
            item === '.git' ||
            item === 'node_modules'
        ) {
            continue;
        }

        const fullPath = path.join(currentDir, item);

        let stat;

        try {
            stat = fs.statSync(fullPath);
        } catch (err) {
            console.error(
                `Không thể truy cập ${fullPath}:`,
                err.message
            );
            continue;
        }

        // =======================================
        // Nếu là thư mục -> đệ quy tiếp tục quét
        // =======================================
        if (stat.isDirectory()) {

            extractInfrastructureCode(fullPath);

        }

        // =======================================
        // Nếu là file -> kiểm tra extension
        // =======================================
        else if (stat.isFile()) {

            const ext = path.extname(fullPath);

            if (allowedExtensions.includes(ext)) {

                try {

                    const content = fs.readFileSync(
                        fullPath,
                        'utf8'
                    );

                    // ===================================
                    // Header phân tách từng file
                    // ===================================
                    const header =
                        `\n// ${'='.repeat(70)}\n` +
                        `// File: ${fullPath.replace(__dirname, '')}\n` +
                        `// ${'='.repeat(70)}\n\n`;

                    // ===================================
                    // Ghi nối tiếp vào file output
                    // ===================================
                    fs.appendFileSync(
                        outputFile,
                        header + content + '\n'
                    );

                } catch (err) {

                    console.error(
                        `Lỗi khi đọc file ${fullPath}:`,
                        err.message
                    );

                }
            }
        }
    }
}

// ===============================================
// Khởi chạy tiến trình
// ===============================================
console.log(
    `[START] Đang trích xuất mã nguồn Infrastructure từ: ${sourceDir}...`
);

extractInfrastructureCode(sourceDir);

console.log(
    `[SUCCESS] Hoàn tất! Mã nguồn Infrastructure đã được lưu tại: ${outputFile}`
);