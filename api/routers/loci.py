from fastapi import APIRouter
from ..db import get_conn

router = APIRouter(prefix="/loci", tags=["loci"])

@router.get("")
def list_loci():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, locus FROM str_loci ORDER BY locus")
        return [{"id": i, "locus": l} for i, l in cur.fetchall()]
