const fs = require('fs');
const path = require('path');

// ==========================
// CẤU HÌNH
// ==========================
const sourceDir = path.join(__dirname, 'backend-core', 'api');

const outputFile = path.join(
    __dirname,
    'api_code_extracted_by_js.txt'
);

const allowedExtensions = [
    '.java',
    '.xml',
    '.yml',
    '.yaml',
    '.properties',
    '.json'
];

// ==========================
// XÓA FILE CŨ
// ==========================
function clearOldFile() {

    try {

        if (fs.existsSync(outputFile)) {

            fs.unlinkSync(outputFile);

            console.log('[INFO] Đã xóa file kết quả cũ.');
        }

    } catch (err) {

        console.error(
            '[ERROR] Không thể xóa file cũ:',
            err.message
        );
    }
}

// ==========================
// HÀM GỘP SOURCE CODE
// ==========================
function extractApiCode(currentDir) {

    let items;

    try {

        items = fs.readdirSync(currentDir);

    } catch (err) {

        console.error(
            `[ERROR] Không thể đọc thư mục ${currentDir}:`,
            err.message
        );

        return;
    }

    for (const item of items) {

        // Bỏ qua thư mục không cần thiết
        if (
            item === 'target' ||
            item === '.git' ||
            item === 'node_modules' ||
            item === '.idea'
        ) {
            continue;
        }

        const fullPath = path.join(currentDir, item);

        let stat;

        try {

            stat = fs.statSync(fullPath);

        } catch (err) {

            console.error(
                `[ERROR] Không thể đọc thông tin file ${fullPath}:`,
                err.message
            );

            continue;
        }

        // ==========================
        // ĐỆ QUY THƯ MỤC
        // ==========================
        if (stat.isDirectory()) {

            extractApiCode(fullPath);
        }

        // ==========================
        // ĐỌC FILE
        // ==========================
        else if (stat.isFile()) {

            const ext = path.extname(fullPath);

            if (allowedExtensions.includes(ext)) {

                try {

                    const content = fs.readFileSync(
                        fullPath,
                        'utf8'
                    );

                    const relativePath = fullPath.replace(
                        __dirname,
                        ''
                    );

                    const header = `
/* ============================================================
   FILE: ${relativePath}
   ============================================================ */
`;

                    fs.appendFileSync(
                        outputFile,
                        header + '\n' + content + '\n\n'
                    );

                    console.log(
                        `[SUCCESS] Đã gộp: ${relativePath}`
                    );

                } catch (err) {

                    console.error(
                        `[ERROR] Không thể đọc file ${fullPath}:`,
                        err.message
                    );
                }
            }
        }
    }
}

// ==========================
// MAIN
// ==========================
console.log('\n[START] Bắt đầu trích xuất mã nguồn API...');

clearOldFile();

extractApiCode(sourceDir);

console.log('\n[DONE] Hoàn tất trích xuất mã nguồn API.');

console.log(
    `📄 File kết quả: ${outputFile}\n`
);