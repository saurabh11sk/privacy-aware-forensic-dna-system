from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import Optional
from uuid import uuid4
import os
import shutil

from ..db import get_conn
from ..dependencies import get_current_user, require_role

router = APIRouter(prefix="/feedback", tags=["feedback"])

# UPLOAD_DIR = "/app/data/uploads/privacy"
# os.makedirs(UPLOAD_DIR, exist_ok=True)
BASE_UPLOAD_DIR = "data/uploads"
UPLOAD_DIR = os.path.join(BASE_UPLOAD_DIR, "privacy")

os.makedirs(UPLOAD_DIR, exist_ok=True)


ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


# =========================
# ✅ POST - Submit Feedback
# =========================
@router.post("")
def submit_feedback(
    module: str = Form(...),
    message: str = Form(...),
    file: Optional[UploadFile] = File(None),
    user=Depends(get_current_user),
):
    user_id = user.get("sub")

    file_path = None

    if file:
        ext = os.path.splitext(file.filename)[1].lower()

        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid file type")

        contents = file.file.read()

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 5MB)")

        # file_id = f"{uuid4()}{ext}"
        # file_path = os.path.join(UPLOAD_DIR, file_id)

        # with open(file_path, "wb") as f:
        #     f.write(contents)
        file_id = f"{uuid4()}{ext}"

        # physical file save location
        physical_path = os.path.join(UPLOAD_DIR, file_id)

        with open(physical_path, "wb") as f:
            f.write(contents)

        # THIS is what we store in DB (public URL path)
        file_path = f"/uploads/privacy/{file_id}"


    feedback_id = str(uuid4())

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            INSERT INTO feedback (id, user_id, module, message, file_path, status)
            VALUES (%s, %s, %s, %s, %s, 'pending')
        """, (feedback_id, user_id, module, message, file_path))
        conn.commit()

    return {"id": feedback_id, "status": "submitted"}


# =========================
# ✅ GET - Admin View All
# =========================
@router.get("")
def get_all_feedback(user=Depends(require_role(["admin"]))):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, user_id, module, message, file_path, status, created_at
            FROM feedback
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()

        return [
            {
                "id": str(r[0]),
                "user_id": str(r[1]),
                "module": r[2],
                "message": r[3],
                "file_path": r[4],
                "status": r[5],
                "created_at": r[6],
            }
            for r in rows
        ]


# =========================
# ✅ GET - User View Own
# =========================
@router.get("/me")
def get_my_feedback(user=Depends(get_current_user)):
    user_id = user.get("sub")

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, module, message, file_path, status, created_at
            FROM feedback
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))
        rows = cur.fetchall()

        return [
            {
                "id": str(r[0]),
                "module": r[1],
                "message": r[2],
                "file_path": r[3],
                "status": r[4],
                "created_at": r[5],
            }
            for r in rows
        ]

from fastapi import Depends
from ..dependencies import require_role
from pydantic import BaseModel

class FeedbackStatusUpdate(BaseModel):
    status: str  # approved / rejected


@router.patch("/{feedback_id}")
def update_feedback_status(
    feedback_id: str,
    body: FeedbackStatusUpdate,
    user=Depends(require_role(["admin"]))
):
    if body.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            UPDATE feedback
            SET status = %s
            WHERE id = %s
            RETURNING id, status
        """, (body.status, feedback_id))

        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Feedback not found")

        conn.commit()

    return {
        "id": row[0],
        "status": row[1]
    }
