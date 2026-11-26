# Dữ liệu demo

## Tạo dữ liệu demo

`seed-demo-data.mjs` tạo dữ liệu qua API của backend-core (cần backend đang chạy, MySQL trong container
`worklify-mysql`, Node 18+):

```powershell
cd backend-core
node scripts/seed-demo-data.mjs                         # backend ở http://localhost:8080
node scripts/seed-demo-data.mjs http://localhost:8082   # backend ở cổng khác
```

Script tạo:

- Danh mục 42 kỹ năng (bảng `reference_values`, loại `SKILL`).
- 3 công ty đã được duyệt, mỗi công ty 2 tin tuyển dụng đang mở (Backend, Frontend, Data Analyst, DevOps,
  Kế toán, Kinh doanh).
- 8 ứng viên có hồ sơ đầy đủ (giới thiệu, kinh nghiệm, dự án, học vấn, kỹ năng) và một CV tạo bằng trình tạo CV.
- 17 đơn ứng tuyển, cố ý có cả ứng viên hợp và không hợp với tin để thử chức năng chấm điểm/xếp hạng AI.

Nếu đã có tài khoản demo, script dừng lại để không tạo trùng.

## Tài khoản demo

Mật khẩu chung cho mọi tài khoản demo: **`Demo@123456`**

| Vai trò | Email | Ghi chú |
|---|---|---|
| Nhà tuyển dụng | `hr.finnova@demo.worklify.test` | FinNova: Backend, Frontend |
| Nhà tuyển dụng | `talent.dataviet@demo.worklify.test` | DataViet: Data Analyst, DevOps |
| Nhà tuyển dụng | `tuyendung.saomai@demo.worklify.test` | Sao Mai: Kế toán, Kinh doanh |
| Ứng viên | `minh.nguyen@demo.worklify.test` | Backend Java 3 năm |
| Ứng viên | `lan.tran@demo.worklify.test` | Fresher Java |
| Ứng viên | `huy.le@demo.worklify.test` | Frontend ReactJS |
| Ứng viên | `thao.pham@demo.worklify.test` | Fullstack Node.js/ReactJS |
| Ứng viên | `nam.vo@demo.worklify.test` | Data Analyst |
| Ứng viên | `tuan.dang@demo.worklify.test` | DevOps |
| Ứng viên | `mai.bui@demo.worklify.test` | Kế toán |
| Ứng viên | `khoa.ho@demo.worklify.test` | Kinh doanh |

Gợi ý thử: đăng nhập `hr.finnova@…`, vào **Quản lý đơn ứng tuyển** → tin Backend → **Chấm điểm AI**
(6 ứng viên từ rất hợp tới không hợp). Hoặc đăng nhập một ứng viên, mở tin → **Xem mức độ phù hợp** →
**Nhờ AI gợi ý sửa hồ sơ**.

## Xoá dữ liệu demo

```powershell
cd backend-core
Get-Content scripts/clean-demo-data.sql | docker exec -i worklify-mysql mysql -uroot -proot123 worklify_db
```

Chỉ xoá tài khoản `@demo.worklify.test` và dữ liệu của họ; danh mục kỹ năng được giữ lại.
