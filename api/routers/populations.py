from fastapi import APIRouter
from ..db import get_conn

router = APIRouter(prefix="/populations", tags=["populations"])

@router.get("")
def list_populations():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, name FROM populations ORDER BY name")
        return [{"id": i, "name": n} for i, n in cur.fetchall()]
