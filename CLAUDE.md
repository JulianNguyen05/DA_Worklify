# CLAUDE.md

Worklify: nền tảng tuyển dụng việc làm với 3 vai trò `CANDIDATE`, `EMPLOYER`, `ADMIN`.
Đồ án môn học; tài liệu nghiệp vụ nằm trong `README.md` và file `.docx` ở gốc repo.

## Cấu trúc repo

- `backend-core/`: Java 21 + Spring Boot, Maven multi-module (DDD + Hexagonal).
- `frontend-app/`: React 18 + Vite 5 + Tailwind 4 (JavaScript/JSX, không dùng TypeScript).
- `backend-ml/`: Python 3.11 + FastAPI, dịch vụ AI (chấm điểm CV–JD; `/parser/extract` chưa triển khai). Chỉ backend-core gọi vào, xác thực bằng header `X-Internal-Api-Key`; không kết nối thẳng DB. Xem `backend-ml/README.md`.
- `docker-compose.yml` (gốc): stack đầy đủ, còn tham chiếu `backend-pdf/` (Node/Puppeteer) **không có trong repo**, nên `docker-compose up` ở gốc sẽ lỗi build.
- `backend-core/docker-compose.yml`: hạ tầng cho dev (MySQL 3307, phpMyAdmin 8089) và `include` `backend-ml/docker-compose.yml` (backend-ml 8000). Đây là file dùng khi chạy backend trên IDE. backend-ml chỉ được định nghĩa ở `backend-ml/docker-compose.yml`, sửa ở đó.
- `worklify_db.sql`, `backend-core/init.sql`: schema + dữ liệu mẫu.
- `gom_code.py`: script gom code để debug, không thuộc ứng dụng.

## Lệnh thường dùng

Hạ tầng (chạy trong `backend-core/`):
```
docker compose up -d
```

Backend (chạy trong `backend-core/`):
```
./mvnw clean install -DskipTests
./mvnw spring-boot:run -pl api -Dspring-boot.run.profiles=dev
```
Swagger UI: http://localhost:8080/swagger-ui.html

Frontend (chạy trong `frontend-app/`):
```
npm install
npm run dev      # http://localhost:5173
npm run build
```

backend-ml: `docker compose up -d --build` (trong `backend-ml/`, hoặc `backend-core/` để chạy cùng hạ tầng); test chạy bằng `pytest` trong `backend-ml/` (máy dev không có Python thì chạy trong container `python:3.11-slim`).

Backend Java và frontend **chưa có test** và chưa có linter. Cách kiểm tra thay đổi: build backend (`./mvnw -q compile`), chạy `npm run build` cho frontend, rồi thử trên giao diện hoặc Swagger.

## Backend: kiến trúc và quy ước

Package gốc `com.worklify.<module>`. Chiều phụ thuộc: `api → application → domain`, `infrastructure → application, domain`.

- **domain**: model nghiệp vụ thuần (không annotation JPA), interface repository, domain event, `DomainPageable`. Không import Spring Data/JPA ở đây.
- **application**: theo từng nghiệp vụ (`auth`, `candidate`, `employer`, `job`, `jobapplication`, `admin`, `referencedata`, `matching`), mỗi nghiệp vụ có `dto/`, `service/` (interface) + `service/impl/`, `port/` (cổng ra ngoài như `CvParsingPort`, `FileStoragePort`, `CvPdfExportPort`). Exception dùng chung nằm ở `common/exception`.
- **infrastructure**: các adapter.
  - `persistence/entity` (JPA entity) + `persistence/mapper` (MapStruct) + `persistence/repository` (Spring Data) + `persistence/adapter` (`XxxRepositoryAdapter` implement interface repository của domain).
  - `security/` (JWT, `JwtAuthenticationFilter`), `config/SecurityConfig.java` (danh sách endpoint public).
  - `pdf/`: PDFBox đọc JSON nhúng trong CV PDF; Playwright render `/cv-print` của frontend ra PDF.
  - `client/`: gọi backend-ml (`worklify.ml.base-url`) — `MlCvParsingClient` (`/parser/extract`), `MlCvJdScoringClient` (`/scoring/cv-jd`, gửi `worklify.internal.api-key`). Lỗi từ ML ném `AiServiceException` → HTTP 503.
  - `storage/LocalFileStorageService`: lưu file upload, phục vụ qua `/uploads/**`.
- **api**: controller theo nghiệp vụ, `GlobalExceptionHandler`, `ApiResponse`.

Khi thêm một tính năng, đi theo thứ tự: model/repository ở domain → DTO + service + port ở application → entity/mapper/adapter ở infrastructure → controller ở api.

Quy ước controller:
- Route dạng `/api/v1/<resource>`; phân quyền bằng `@PreAuthorize("hasRole('EMPLOYER')")`.
- Luôn trả về `ApiResponse.success(data[, message])`; message viết bằng tiếng Việt.
- Có `@Tag(name = "N. Tên nhóm")` và `@Operation(summary = ...)` cho Swagger (tag được đánh số để sắp xếp).
- Dùng Lombok (`@RequiredArgsConstructor`, inject qua constructor) và `@Valid` cho request body.

Endpoint public (không cần JWT) được khai báo trong `SecurityConfig`: auth, swagger, `/uploads/**`, `GET /api/v1/jobs/**`, `GET /api/v1/employers/**`, `/api/internal/**` (tự bảo vệ bằng API key).

Cấu hình: `application.yml` (`ddl-auto: none`) và `application-dev.yml` (`ddl-auto: update`). Profile mặc định là `dev`. Dự án **không dùng message broker** (RabbitMQ/Kafka đã được gỡ bỏ), đừng thêm lại.

## Frontend: quy ước

- Alias `@/` → `src/` (xem `jsconfig.json`).
- `src/services/axiosClient.js`: axios instance, tự gắn `Bearer` token lấy từ `localStorage.user.accessToken`. baseURL đã gồm `/api/v1`, nên service chỉ gọi đường dẫn như `/jobs/search`.
- `src/features/<domain>/<domain>Service.js`: object gom các hàm gọi API, trả về `response.data`.
- `src/pages/<role>/<PageName>/index.jsx`: trang theo vai trò (`public`, `auth`, `candidate`, `employer`, `admin`); `src/router/index.jsx`: định tuyến.
- `src/components/common/*`: UI dùng chung (Button, Input, Modal, Table…); `components/layout/*`: layout theo vai trò; `components/cv-builder/*`: trình tạo CV (dnd-kit, react-grid-layout, TipTap).
- Form: react-hook-form + zod. State: Redux Toolkit. Thông báo: react-hot-toast. Icon: lucide-react.
- `pages/candidate/CvPrintPage` được backend (Playwright) mở để xuất PDF, nên thay đổi trang này ảnh hưởng tới file CV export.

## Lưu ý / bẫy đã biết

- Biến môi trường frontend không khớp nhau: `.env.development` đặt `VITE_API_URL`, nhưng `axiosClient` đọc `VITE_API_BASE_URL` (nên đang dùng giá trị fallback `http://localhost:8080/api/v1`). `docker-compose.yml` ở gốc lại đặt `VITE_API_BASE_URL` thiếu `/api/v1`.
- Giới hạn upload là 10MB, phải đặt ở cả `spring.servlet.multipart` lẫn `server.tomcat.max-http-form-post-size`, nếu không Tomcat sẽ reset kết nối.
- Mật khẩu DB và JWT secret đang ghi thẳng trong file cấu hình (chấp nhận được cho môi trường đồ án, đừng đưa thêm secret thật vào repo).
- Comment và message trong code chủ yếu viết bằng tiếng Việt; giữ nguyên phong cách đó.
