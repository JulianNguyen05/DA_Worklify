"""Chỉ cho backend-core gọi các endpoint nội bộ, xác thực bằng header X-Internal-Api-Key."""
from __future__ import annotations

import secrets

from fastapi import Header, HTTPException, status

from app.config import settings


def verify_internal_api_key(x_internal_api_key: str | None = Header(default=None)) -> None:
    if not settings.require_api_key:
        return
    if not x_internal_api_key or not secrets.compare_digest(x_internal_api_key, settings.internal_api_key):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="API key không hợp lệ")
