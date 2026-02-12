# from datetime import datetime
# import uuid
# import json
# from typing import List, Optional

# from fastapi import APIRouter, HTTPException, Query, Depends
# from pydantic import BaseModel

# from ..db import get_conn
# from ..dependencies import require_role

# router = APIRouter(prefix="/evidence", tags=["evidence"])

# # =====================================================
# # HELPERS
# # =====================================================

# def safe_iso(value):
#     if value is None:
#         return None
#     if isinstance(value, datetime):
#         return value.isoformat()
#     return str(value)

# def safe_json(value):
#     if value is None:
#         return None
#     if isinstance(value, dict):
#         return value
#     return json.loads(value)

# # =====================================================
# # INPUT MODELS
# # =====================================================

# class GenotypeIn(BaseModel):
#     locus: str
#     allele1: str
#     allele2: str

# class EvidenceIn(BaseModel):
#     sample_id: Optional[str] = None
#     population: Optional[str] = None
#     notes: Optional[str] = None
#     genotypes: List[GenotypeIn]

# # =====================================================
# # POST /evidence
# # =====================================================

# @router.post(
#     "",
#     dependencies=[Depends(require_role(["field", "investigator", "admin"]))],
#     summary="Submit evidence sample with genotypes"
# )
# def submit_evidence(body: EvidenceIn):

#     if not body.genotypes:
#         raise HTTPException(400, "Evidence must contain at least one genotype")

#     evidence_id = str(uuid.uuid4())

#     metadata = {
#         "sample_id": body.sample_id,
#         "population": body.population,
#         "notes": body.notes,
#         "submitted_at": datetime.utcnow().isoformat()
#     }

#     with get_conn() as conn, conn.cursor() as cur:
#         try:
#             cur.execute("""
#                 INSERT INTO evidence (id, evidence_code, submitted_by, metadata)
#                 VALUES (%s, %s, NULL, %s)
#             """, (
#                 evidence_id,
#                 body.sample_id or evidence_id,
#                 json.dumps(metadata)
#             ))

#             for g in body.genotypes:
#                 cur.execute(
#                     "SELECT id FROM str_loci WHERE locus = %s",
#                     (g.locus,)
#                 )
#                 locus = cur.fetchone()

#                 if not locus:
#                     raise HTTPException(
#                         status_code=400,
#                         detail=f"Unknown locus: {g.locus}"
#                     )

#                 cur.execute("""
#                     INSERT INTO evidence_genotypes
#                     (evidence_id, locus_id, allele1, allele2)
#                     VALUES (%s, %s, %s, %s)
#                 """, (
#                     evidence_id,
#                     locus[0],
#                     g.allele1,
#                     g.allele2
#                 ))

#             conn.commit()

#         except HTTPException:
#             conn.rollback()
#             raise
#         except Exception as e:
#             conn.rollback()
#             raise HTTPException(500, str(e))

#     return {
#         "evidence_id": evidence_id,
#         "status": "stored"
#     }

# # =====================================================
# # GET /evidence
# # =====================================================

# @router.get(
#     "",
#     dependencies=[Depends(require_role(["investigator", "admin"]))],
#     summary="List recent evidence"
# )
# def list_evidence(
#     limit: int = Query(10, ge=1, le=100),
#     offset: int = Query(0, ge=0)
# ):
#     with get_conn() as conn, conn.cursor() as cur:
#         cur.execute("""
#             SELECT id, evidence_code, received_at, metadata
#             FROM evidence
#             ORDER BY received_at DESC NULLS LAST
#             LIMIT %s OFFSET %s
#         """, (limit, offset))

#         rows = cur.fetchall()

#     return {
#         "count": len(rows),
#         "items": [
#             {
#                 "id": str(r[0]),
#                 "evidence_code": r[1],
#                 "received_at": safe_iso(r[2]),
#                 "metadata": safe_json(r[3])
#             }
#             for r in rows
#         ]
#     }

# # =====================================================
# # GET /evidence/{evidence_id}
# # =====================================================

# @router.get(
#     "/{evidence_id}",
#     dependencies=[Depends(require_role(["investigator", "admin"]))],
#     summary="Get single evidence record"
# )
# def get_evidence(evidence_id: str):

#     with get_conn() as conn, conn.cursor() as cur:
#         cur.execute("""
#             SELECT id, evidence_code, submitted_by, received_at, metadata
#             FROM evidence
#             WHERE id = %s
#         """, (evidence_id,))
#         row = cur.fetchone()

#         if not row:
#             raise HTTPException(404, "Evidence not found")

#         cur.execute("""
#             SELECT l.locus, eg.allele1, eg.allele2
#             FROM evidence_genotypes eg
#             JOIN str_loci l ON l.id = eg.locus_id
#             WHERE eg.evidence_id = %s
#             ORDER BY l.locus
#         """, (evidence_id,))

#         genotypes = [
#             {"locus": r[0], "allele1": r[1], "allele2": r[2]}
#             for r in cur.fetchall()
#         ]

#     return {
#         "id": str(row[0]),
#         "evidence_code": row[1],
#         "submitted_by": str(row[2]) if row[2] else None,
#         "received_at": safe_iso(row[3]),
#         "metadata": safe_json(row[4]),
#         "genotypes": genotypes
#     }

# # =====================================================
# # GET /evidence/{evidence_id}/matches
# # =====================================================

# @router.get(
#     "/{evidence_id}/matches",
#     dependencies=[Depends(require_role(["investigator", "admin"]))],
#     summary="Get stored matches"
# )
# def get_evidence_matches(evidence_id: str):

#     with get_conn() as conn, conn.cursor() as cur:
#         cur.execute("""
#             SELECT id, profile_id, score, matched_at
#             FROM evidence_matches
#             WHERE evidence_id = %s
#             ORDER BY score DESC NULLS LAST
#         """, (evidence_id,))

#         rows = cur.fetchall()

#     return {
#         "count": len(rows),
#         "items": [
#             {
#                 "id": str(r[0]),
#                 "profile_id": str(r[1]) if r[1] else None,
#                 "score": float(r[2]) if r[2] is not None else None,
#                 "matched_at": safe_iso(r[3])
#             }
#             for r in rows
#         ]
#     }


from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from ..db import get_conn
import json, uuid, datetime

router = APIRouter(prefix="/evidence", tags=["evidence"])

# -------------------------------
# Data Models
# -------------------------------
class GenotypeIn(BaseModel):
    locus: str
    allele1: str
    allele2: str

class EvidenceIn(BaseModel):
    sample_id: Optional[str] = None
    population: Optional[str] = None
    notes: Optional[str] = None
    genotypes: List[GenotypeIn]

# -------------------------------
# POST: Submit new evidence
# -------------------------------
@router.post("", summary="Submit evidence sample with genotypes")
def submit_evidence(body: EvidenceIn):
    evidence_id = str(uuid.uuid4())

    metadata = {
        "sample_id": body.sample_id,
        "population": body.population,
        "notes": body.notes,
        "genotypes": [g.dict() for g in body.genotypes],
        "submitted_at": datetime.datetime.utcnow().isoformat()
    }

    with get_conn() as conn, conn.cursor() as cur:
        # Insert evidence
        cur.execute("""
            INSERT INTO evidence (id, evidence_code, submitted_by, metadata)
            VALUES (%s, %s, NULL, %s)
        """, (evidence_id, body.sample_id or evidence_id, json.dumps(metadata)))

        # Insert genotypes
        for g in body.genotypes:
            cur.execute("""
                INSERT INTO evidence_genotypes (evidence_id, locus_id, allele1, allele2)
                SELECT %s, l.id, %s, %s FROM str_loci l WHERE l.locus = %s
            """, (evidence_id, g.allele1, g.allele2, g.locus))

        conn.commit()

    return {"evidence_id": evidence_id, "status": "stored"}

# -------------------------------
# GET: List recent evidence
# -------------------------------
@router.get("", summary="List recent evidence")
def list_evidence(limit: int = Query(10, ge=1, le=100), offset: int = 0):
    """Return recent evidence entries."""
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, evidence_code, received_at, metadata
            FROM evidence
            ORDER BY received_at DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))
        rows = cur.fetchall()

        results = []
        for row in rows:
            results.append({
                "id": str(row[0]),
                "evidence_code": row[1],
                "received_at": row[2].isoformat() if row[2] else None,
                "metadata": row[3] if isinstance(row[3], dict)
                else (json.loads(row[3]) if row[3] else None)
            })

        return {"count": len(results), "items": results}

# -------------------------------
# GET: Single evidence by ID
# -------------------------------
@router.get("/{evidence_id}", summary="Get single evidence record with genotypes")
def get_evidence(evidence_id: str):
    """Return one evidence record and its genotypes."""
    with get_conn() as conn, conn.cursor() as cur:
        # Fetch main evidence info
        cur.execute("""
            SELECT id, evidence_code, submitted_by, received_at, metadata
            FROM evidence
            WHERE id = %s
        """, (evidence_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Evidence not found")

        evidence = {
            "id": str(row[0]),
            "evidence_code": row[1],
            "submitted_by": str(row[2]) if row[2] else None,
            "received_at": row[3].isoformat() if row[3] else None,
            "metadata": row[4] if isinstance(row[4], dict)
            else (json.loads(row[4]) if row[4] else None)
        }

        # Fetch genotype details
        cur.execute("""
            SELECT l.locus, eg.allele1, eg.allele2
            FROM evidence_genotypes eg
            JOIN str_loci l ON eg.locus_id = l.id
            WHERE eg.evidence_id = %s
            ORDER BY l.locus
        """, (evidence_id,))
        genos = [{"locus": r[0], "allele1": r[1], "allele2": r[2]} for r in cur.fetchall()]
        evidence["genotypes"] = genos

        return evidence

# -------------------------------
# GET: Stored matches for an evidence
# -------------------------------
@router.get("/{evidence_id}/matches", summary="Get stored matches for an evidence")
def get_evidence_matches(evidence_id: str):
    """Return rows from evidence_matches for a given evidence id."""
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, profile_id, score, matched_at
            FROM evidence_matches
            WHERE evidence_id = %s
            ORDER BY score DESC NULLS LAST
        """, (evidence_id,))
        rows = cur.fetchall()

        items = []
        for r in rows:
            items.append({
                "id": str(r[0]),
                "profile_id": str(r[1]) if r[1] else None,
                "score": float(r[2]) if r[2] is not None else None,
                "matched_at": r[3].isoformat() if r[3] else None
            })

        return {"count": len(items), "items": items}

