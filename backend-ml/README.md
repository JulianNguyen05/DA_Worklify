# Worklify ML Service (backend-ml)

Dịch vụ FastAPI chạy các model AI cho Worklify. Chỉ backend-core gọi vào service này
(xác thực bằng header `X-Internal-Api-Key`); service không kết nối thẳng vào database.

```
Frontend ──► backend-core (Spring, :8080) ──HTTP──► backend-ml (FastAPI, :8000)
```

## Endpoint

| Method | Path | Mô tả |
|---|---|---|
| GET | `/health` | Trạng thái và model đang dùng |
| POST | `/scoring/cv-jd` | Chấm điểm mức độ phù hợp CV–JD (cần API key) |
| POST | `/parser/extract` | Phân tích file CV, **chưa triển khai** (trả 501) |

Tài liệu tương tác: http://localhost:8000/docs

Ví dụ `POST /scoring/cv-jd`:

```json
{
  "cv": { "text": "Backend 3 năm Java, Spring Boot...", "skills": ["Docker"], "yearsOfExperience": 3 },
  "jd": { "text": "Tuyển Java Developer, tối thiểu 2 năm kinh nghiệm..." }
}
```

Kết quả gồm điểm tổng (0–100), điểm thành phần (`semantic`, `skills`, `experience`),
kỹ năng khớp/còn thiếu và câu giải thích. Cách tính nằm trong `app/services/scorer.py`.

## Chạy

**Bằng Docker** (khuyến nghị, máy không cần cài Python):

```powershell
cd backend-core
docker compose up -d --build backend-ml
```

Lần đầu khởi động sẽ tải model khoảng 470MB nên mất vài phút. Muốn chạy bản nhẹ
(không torch, chấm ngữ nghĩa bằng bag-of-words) thì build với `INSTALL_ML=false`
và đặt `EMBEDDING_BACKEND=bow`.

**Trực tiếp bằng Python 3.11+:**

```powershell
cd backend-ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
pip install torch==2.15.0 --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements-ml.txt
uvicorn app.main:app --reload --port 8000
```

Chạy test: `pytest`

## Cấu hình (biến môi trường)

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `EMBEDDING_BACKEND` | `sentence-transformers` | Hoặc `bow` để chạy không cần torch |
| `MODEL_PATH` | `models/cv-jd-scorer` | Model fine-tune từ Colab (xem `models/README.md`) |
| `MODEL_NAME` | `paraphrase-multilingual-MiniLM-L12-v2` | Model có sẵn, dùng khi chưa có `MODEL_PATH` |
| `CORE_BASE_URL` | `http://localhost:8080` | Để lấy danh mục kỹ năng; để trống thì dùng danh sách có sẵn |
| `INTERNAL_API_KEY` | `local-dev-only-change-me` | Phải trùng `worklify.internal.api-key` bên backend-core |
| `REQUIRE_API_KEY` | `true` | Tắt khi muốn thử nhanh qua `/docs` |
| `WEIGHT_SEMANTIC` / `WEIGHT_SKILLS` / `WEIGHT_EXPERIENCE` | `0.45` / `0.40` / `0.15` | Trọng số điểm |
| `SEMANTIC_SIM_LOW` / `SEMANTIC_SIM_HIGH` | `0.15` / `0.75` | Ngưỡng kéo giãn cosine similarity |

## Huấn luyện model trên Colab

- Dữ liệu: `data/README.md` (dataset gộp, tạo bằng `scripts/build_dataset.py`)
- Notebook: `notebooks/README.md`

## Cấu trúc

```
app/
├── main.py            # khởi tạo FastAPI, nạp model khi start
├── config.py          # biến môi trường
├── security.py        # kiểm tra X-Internal-Api-Key
├── schemas.py         # request/response (JSON camelCase)
├── routers/           # scoring.py, parser.py
└── services/
    ├── embedder.py    # model embedding (sentence-transformers / bag-of-words)
    ├── skills.py      # danh mục và trích xuất kỹ năng
    ├── scorer.py      # ghép điểm và sinh giải thích
    └── text_utils.py
data/                  # dataset CV–JD gộp (không commit file .csv.gz)
models/                # model fine-tune (không commit file trọng số)
notebooks/             # notebook huấn luyện trên Colab
scripts/               # build_dataset.py: tải và gộp dataset
tests/
```
