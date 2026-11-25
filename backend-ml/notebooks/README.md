# Huấn luyện model chấm điểm CV–JD trên Colab

Notebook: [`train_cv_jd_scorer.ipynb`](train_cv_jd_scorer.ipynb)

## Model có sẵn và model tự fine-tune

backend-ml mặc định dùng `paraphrase-multilingual-MiniLM-L12-v2`, một model **có sẵn**
trên Hugging Face. Notebook này **fine-tune** chính model đó trên dữ liệu cặp (CV, JD,
mức độ phù hợp) của bạn, để nó hiểu thế nào là "phù hợp" trong bối cảnh tuyển dụng.
Train từ đầu không khả thi (cần hàng triệu cặp câu và nhiều GPU), nên fine-tune là cách làm chuẩn.

## Cách dùng

1. Mở Colab → **File → Upload notebook** → chọn `train_cv_jd_scorer.ipynb`.
2. **Runtime → Change runtime type → T4 GPU**.
3. Ở ô cấu hình, chọn `DATA_SOURCE`:
   - `"demo"`: dữ liệu giả để chạy thử toàn bộ quy trình (kết quả không dùng cho báo cáo)
   - `"upload"` / `"drive"`: file CSV thật với 3 cột `cv_text`, `jd_text`, `label` (0–1).
     Dùng dataset gộp sẵn `backend-ml/data/cv_jd_pairs.csv.gz` (xem [`data/README.md`](../data/README.md)).
4. **Runtime → Run all**. Notebook sẽ:
   - đo baseline của model có sẵn trên tập test,
   - fine-tune, đo lại trên cùng tập test và in bảng so sánh (Spearman, Pearson),
   - đề xuất giá trị `SEMANTIC_SIM_LOW` / `SEMANTIC_SIM_HIGH`,
   - lưu model và tải về file `cv-jd-scorer.zip`.
5. Giải nén vào `backend-ml/models/` (thành `backend-ml/models/cv-jd-scorer/`), đặt 2 ngưỡng
   vào `environment` của service `backend-ml` trong docker-compose, rồi khởi động lại.
   `GET /health` phải trả `"model": "local:cv-jd-scorer"`.

Sau khi chạy với dữ liệu thật, lưu lại bản notebook có output (File → Download .ipynb)
vào thư mục này để làm minh chứng cho báo cáo.

## Dữ liệu

Dataset gộp từ 4 bộ trên Hugging Face: xem [`data/README.md`](../data/README.md).
Nên bổ sung thêm cặp tiếng Việt (tự soạn, hoặc đơn ứng tuyển `ACCEPTED`/`REJECTED` từ chính Worklify)
vì toàn bộ dataset hiện là tiếng Anh.
