# Huấn luyện model chấm điểm CV–JD trên Colab

Lưu notebook Colab vào thư mục này để làm minh chứng cho báo cáo.

## 1. Chuẩn bị dữ liệu

Mỗi mẫu là một cặp (CV, JD) kèm nhãn mức độ phù hợp trong khoảng 0–1:

| cv_text | jd_text | label |
|---|---|---|
| "Backend 3 năm Java, Spring..." | "Tuyển Java Developer..." | 0.9 |
| "Kế toán tổng hợp..." | "Tuyển Java Developer..." | 0.1 |

Gợi ý nguồn dữ liệu: bộ dữ liệu resume–job công khai trên Kaggle/Hugging Face,
CV và JD mẫu tự tạo (có thể nhờ LLM sinh rồi gán nhãn lại thủ công), dữ liệu thật
từ chính hệ thống Worklify (đơn ứng tuyển được nhà tuyển dụng ACCEPTED/REJECTED).

## 2. Fine-tune (chạy trên Colab, bật GPU)

```python
!pip install sentence-transformers==3.1.1

import pandas as pd
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

df = pd.read_csv("cv_jd_pairs.csv")
examples = [InputExample(texts=[r.cv_text, r.jd_text], label=float(r.label)) for r in df.itertuples()]

model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
loader = DataLoader(examples, shuffle=True, batch_size=16)
loss = losses.CosineSimilarityLoss(model)
model.fit(train_objectives=[(loader, loss)], epochs=3, warmup_steps=100)

model.save("cv-jd-scorer")
!zip -r cv-jd-scorer.zip cv-jd-scorer
```

Nhớ tách tập test riêng và báo cáo kết quả trước/sau fine-tune
(vd Spearman correlation giữa điểm dự đoán và nhãn).

## 3. Đưa model vào service

1. Tải `cv-jd-scorer.zip` từ Colab, giải nén vào `backend-ml/models/cv-jd-scorer/`.
2. Khởi động lại backend-ml; `GET /health` phải trả `"model": "local:cv-jd-scorer"`.
3. Đo lại `SEMANTIC_SIM_LOW` / `SEMANTIC_SIM_HIGH` trên tập test: đặt LOW gần điểm
   similarity của cặp không phù hợp, HIGH gần điểm của cặp rất phù hợp.
