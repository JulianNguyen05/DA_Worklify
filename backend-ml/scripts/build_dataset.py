"""
Tải 4 bộ dữ liệu CV–JD công khai trên Hugging Face, chuẩn hoá và gộp thành một file
data/cv_jd_pairs.csv.gz để fine-tune model (notebooks/train_cv_jd_scorer.ipynb).

Cột đầu ra:
    cv_text, jd_text   văn bản CV và JD
    label              mức độ phù hợp 0–1 (càng cao càng phù hợp)
    source             bộ dữ liệu gốc
    original_label     nhãn/điểm gốc trước khi chuẩn hoá

Cách chuẩn hoá nhãn:
    cnamuangtoun  No Fit / Potential Fit / Good Fit -> 0.1 / 0.5 / 0.9
    0xnbk         ats_score / 100. Bộ này là các cặp của cnamuangtoun đã được làm sạch văn bản
                  (điểm ATS tương quan 0.99 với nhãn gốc), nên cặp trùng bị loại, chỉ giữ cặp mới.
    netsol        điểm GPT-4o (0–10), kéo giãn khoảng phân vị 5%–95% về 0.1–0.9
    scmlewis      0 / 1 -> 0.1 / 0.9

Chạy (cần: pip install huggingface_hub pandas pyarrow):
    python scripts/build_dataset.py
Biến môi trường tuỳ chọn: RAW_DIR (nơi lưu dữ liệu tải về), OUT_DIR (nơi ghi kết quả).
"""
from __future__ import annotations

import glob
import hashlib
import json
import os
import re
from pathlib import Path

import pandas as pd
from huggingface_hub import snapshot_download

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = Path(os.getenv("RAW_DIR", ROOT / "data" / "raw"))
OUT_DIR = Path(os.getenv("OUT_DIR", ROOT / "data"))

SOURCES = {
    "cnamuangtoun": ("cnamuangtoun/resume-job-description-fit", ["*.csv"]),
    "0xnbk": ("0xnbk/resume-ats-score-v1-en", ["*.csv"]),
    "netsol": ("netsol/resume-score-details", ["*.json"]),
    "scmlewis": ("scmlewis/Resume_Screening_Data_Classification", ["*.parquet"]),
}

# Nhãn 3 mức -> điểm. Không dùng 0 và 1 tuyệt đối vì nhãn gốc vốn thô.
FIT_LABELS = {"No Fit": 0.1, "Potential Fit": 0.5, "Good Fit": 0.9}

MIN_CHARS = 30


def download(name: str) -> Path:
    repo, patterns = SOURCES[name]
    path = snapshot_download(repo_id=repo, repo_type="dataset", allow_patterns=patterns,
                             local_dir=RAW_DIR / repo.replace("/", "__"))
    return Path(path)


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", str(text)).strip()


def pair_key(cv: str, jd: str, prefix: int = 300) -> str:
    """
    Khoá nhận diện cặp trùng: 300 ký tự chữ-số đầu tiên của CV và JD.
    So khớp lỏng như vậy để bắt được bản 0xnbk (đã sửa dấu câu, cắt ngắn JD) của cùng một cặp.
    """
    def norm(s: str) -> str:
        return re.sub(r"[^a-z0-9]", "", str(s).lower())[:prefix]

    return hashlib.sha1((norm(cv) + "\x00" + norm(jd)).encode()).hexdigest()


# ---------------------------------------------------------------------------
# Từng nguồn -> DataFrame(cv_text, jd_text, label, source, original_label)
# ---------------------------------------------------------------------------

def load_cnamuangtoun() -> pd.DataFrame:
    path = download("cnamuangtoun")
    df = pd.concat([pd.read_csv(path / f) for f in ("train.csv", "test.csv")], ignore_index=True)
    return pd.DataFrame({
        "cv_text": df["resume_text"],
        "jd_text": df["job_description_text"],
        "label": df["label"].map(FIT_LABELS),
        "source": "cnamuangtoun",
        "original_label": df["label"],
    })


def load_0xnbk() -> pd.DataFrame:
    path = download("0xnbk")
    df = pd.concat([pd.read_csv(path / f) for f in ("train.csv", "validation.csv")], ignore_index=True)
    parts = df["text"].str.split(" SEP ", n=1, expand=True)
    return pd.DataFrame({
        "cv_text": parts[0],
        "jd_text": parts[1],
        "label": (df["ats_score"] / 100).clip(0, 1),
        "source": "0xnbk",
        "original_label": df["original_label"] + " / ats=" + df["ats_score"].round(1).astype(str),
    })


def load_netsol() -> pd.DataFrame:
    path = download("netsol")
    rows = []
    for f in sorted(glob.glob(str(path / "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        out, inp = d.get("output", {}), d.get("input", {})
        score = (out.get("scores") or {}).get("aggregated_scores", {}).get("macro_scores")
        if not out.get("valid_resume_and_jd") or score is None:
            continue  # bỏ các bản ghi CV/JD không hợp lệ (gibberish, invalid_*)
        group = os.path.basename(f).rsplit("_", 1)[0]
        rows.append({
            "cv_text": inp.get("resume"),
            "jd_text": inp.get("job_description"),
            "score": float(score),
            "source": "netsol",
            "original_label": f"{group} / macro={float(score):.2f}",
        })
    df = pd.DataFrame(rows)
    # GPT-4o hiếm khi cho điểm sát 0 hoặc 10, nên kéo giãn khoảng phân vị 5%–95% về 0.1–0.9
    # để cùng thang với các nguồn khác.
    lo, hi = df["score"].quantile(0.05), df["score"].quantile(0.95)
    df["label"] = (0.1 + 0.8 * (df["score"] - lo) / (hi - lo)).clip(0, 1)
    return df.drop(columns="score")


def load_scmlewis() -> pd.DataFrame:
    path = download("scmlewis")
    df = pd.concat([pd.read_parquet(f) for f in sorted(glob.glob(str(path / "data" / "*.parquet")))],
                   ignore_index=True)
    parts = df["text"].str.split(r"\s*\[sep\]\s*", n=1, expand=True, regex=True)
    return pd.DataFrame({
        "cv_text": parts[0].str.replace(r"^\s*resume:\s*", "", regex=True),
        "jd_text": parts[1].str.replace(r"^\s*job:\s*", "", regex=True),
        "label": df["label"].map({1: 0.9, 0: 0.1}),
        "source": "scmlewis",
        "original_label": df["label"].astype(str),
    })


# ---------------------------------------------------------------------------

def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    frames = {
        "cnamuangtoun": load_cnamuangtoun(),
        "0xnbk": load_0xnbk(),
        "netsol": load_netsol(),
        "scmlewis": load_scmlewis(),
    }
    report: dict = {"sources": {}}
    for name, df in frames.items():
        report["sources"][name] = {"rows_raw": len(df)}

    # Thứ tự ưu tiên khi trùng cặp (CV, JD): nhãn gốc của cnamuangtoun được giữ lại,
    # bản 0xnbk (cùng cặp nhưng điểm do model chấm lại) bị loại.
    merged = pd.concat(list(frames.values()), ignore_index=True)
    merged = merged.dropna(subset=["cv_text", "jd_text", "label"])
    merged["cv_text"] = merged["cv_text"].astype(str).str.strip()
    merged["jd_text"] = merged["jd_text"].astype(str).str.strip()
    merged = merged[(merged["cv_text"].str.len() >= MIN_CHARS) & (merged["jd_text"].str.len() >= MIN_CHARS)]
    merged["_key"] = [pair_key(c, j) for c, j in zip(merged["cv_text"], merged["jd_text"])]
    before = len(merged)
    merged = merged.drop_duplicates("_key", keep="first").drop(columns="_key").reset_index(drop=True)
    merged["label"] = merged["label"].round(4)
    merged = merged[["cv_text", "jd_text", "label", "source", "original_label"]]

    report["duplicates_removed"] = before - len(merged)
    for name in frames:
        sub = merged[merged["source"] == name]
        report["sources"][name].update({
            "rows_kept": len(sub),
            "label_mean": round(float(sub["label"].mean()), 3) if len(sub) else None,
        })
    report["total_rows"] = len(merged)
    report["label_distribution"] = {
        "low (<0.3)": int((merged["label"] < 0.3).sum()),
        "mid (0.3-0.7)": int(((merged["label"] >= 0.3) & (merged["label"] <= 0.7)).sum()),
        "high (>0.7)": int((merged["label"] > 0.7).sum()),
    }
    netsol = merged[merged["source"] == "netsol"]
    if len(netsol):
        groups = netsol["original_label"].str.split(" / ").str[0]
        report["netsol_label_mean_by_group"] = netsol.groupby(groups)["label"].mean().round(3).to_dict()

    out_csv = OUT_DIR / "cv_jd_pairs.csv.gz"
    merged.to_csv(out_csv, index=False, compression="gzip")
    (OUT_DIR / "dataset_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"\nĐã ghi {out_csv} ({out_csv.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
