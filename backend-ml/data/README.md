# Dataset CV–JD

`cv_jd_pairs.csv.gz` (~23MB, **không commit vào git**) gộp 4 bộ dữ liệu công khai trên
Hugging Face thành **11.367 cặp** (CV, JD, mức độ phù hợp). Tạo lại bằng:

```powershell
cd backend-ml
pip install huggingface_hub pandas pyarrow
python scripts/build_dataset.py
```

Không có Python trên máy thì chạy trong Docker (từ thư mục `backend-ml`):

```powershell
docker run --rm -v "${PWD}:/work" -w /work python:3.11-slim sh -c "pip install -q huggingface_hub pandas pyarrow && python scripts/build_dataset.py"
```

Thống kê chi tiết của lần tạo gần nhất: [`dataset_report.json`](dataset_report.json).

## Cột

| Cột | Ý nghĩa |
|---|---|
| `cv_text` | Văn bản CV |
| `jd_text` | Văn bản mô tả công việc |
| `label` | Mức độ phù hợp 0–1 (càng cao càng phù hợp) |
| `source` | Bộ dữ liệu gốc |
| `original_label` | Nhãn/điểm gốc trước khi chuẩn hoá |

## Nguồn

| Bộ | Số cặp giữ lại | Nội dung | Nhãn gốc → `label` | Giấy phép |
|---|---|---|---|---|
| [cnamuangtoun/resume-job-description-fit](https://huggingface.co/datasets/cnamuangtoun/resume-job-description-fit) | 7.743 | CV thật (nhiều ngành) và JD thật | No / Potential / Good Fit → 0.1 / 0.5 / 0.9 | Không ghi |
| [0xnbk/resume-ats-score-v1-en](https://huggingface.co/datasets/0xnbk/resume-ats-score-v1-en) | 39 | Chính các cặp của cnamuangtoun, đã làm sạch văn bản và chấm điểm ATS | `ats_score / 100` | Apache 2.0 |
| [netsol/resume-score-details](https://huggingface.co/datasets/netsol/resume-score-details) | 651 | CV thật, JD do GPT-4o viết, GPT-4o chấm điểm | Điểm 0–10, kéo giãn phân vị 5%–95% về 0.1–0.9 | CC |
| [scmlewis/Resume_Screening_Data_Classification](https://huggingface.co/datasets/scmlewis/Resume_Screening_Data_Classification) | 2.934 | CV/JD tổng hợp, ngắn (kỹ năng, số năm) | 0 / 1 → 0.1 / 0.9 | Không ghi |

Đã loại 6.791 dòng trùng (so khớp 300 ký tự chữ-số đầu của CV và JD), phần lớn là các cặp
0xnbk trùng với cnamuangtoun (điểm ATS của chúng tương quan 0.99 với nhãn gốc, nên không thêm thông tin).

## Lưu ý khi dùng

- **Toàn bộ là tiếng Anh**, trong khi Worklify dùng tiếng Việt. Model đa ngôn ngữ vẫn học được
  phần nào, nhưng nên bổ sung một ít cặp tiếng Việt (tự soạn hoặc lấy từ đơn ứng tuyển trên hệ thống)
  và đánh giá riêng trên chúng.
- **Nhãn không đồng nhất giữa các nguồn**: nhãn 3 mức (cnamuangtoun), điểm GPT-4o (netsol), nhãn 0/1
  của dữ liệu tổng hợp (scmlewis). Khi báo cáo nên tách kết quả theo `source`.
- cnamuangtoun dùng lại cùng một JD cho nhiều CV, nên khi chia train/test ngẫu nhiên, một JD có thể
  xuất hiện ở cả hai tập; kết quả test vì vậy có thể hơi lạc quan.
- Hai bộ không ghi giấy phép: chỉ nên dùng cho mục đích học tập/nghiên cứu, và ghi rõ nguồn trong báo cáo.
