# Thư mục model

Đặt model đã fine-tune trên Colab vào `models/cv-jd-scorer/` (đúng cấu trúc do
`model.save(...)` của sentence-transformers sinh ra: `config.json`, `modules.json`,
`model.safetensors`, tokenizer...).

- Có thư mục này: service dùng model của bạn (`/health` trả `"model": "local:cv-jd-scorer"`).
- Không có: service tự tải model có sẵn `MODEL_NAME` từ Hugging Face.
- Đổi đường dẫn bằng biến môi trường `MODEL_PATH`.

File trọng số (`*.safetensors`, `*.bin`...) đã bị `.gitignore` chặn vì quá nặng:
mỗi người tự tải model về máy, hoặc đẩy lên Hugging Face Hub rồi đặt `MODEL_PATH`
thành tên repo (vd `ten-ban/worklify-cv-jd`).
