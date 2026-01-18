from fastapi import APIRouter, HTTPException, Query
from ..db import get_conn
import uuid
import datetime
from ..dependencies import require_role
from fastapi import Depends

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get(
    "/partial/{evidence_id}",
    dependencies=[Depends(require_role(["investigator", "admin"]))],
    summary="Partial DNA match against profiles"
)
def partial_match(evidence_id: str, top: int = Query(20, ge=1, le=200)):

    with get_conn() as conn, conn.cursor() as cur:

        # ===============================
        # STEP 1 (OLD) : GET EVIDENCE DATA
        # ===============================
        cur.execute("""
            SELECT locus_id, allele1, allele2
            FROM evidence_genotypes
            WHERE evidence_id = %s
        """, (evidence_id,))
        ev_rows = cur.fetchall()

        if not ev_rows:
            raise HTTPException(404, "Evidence not found or empty")

        loci_ids = [r[0] for r in ev_rows]

        # =====================================
        # 🔧 FIX 1 (NEW): CLEAR OLD MATCHES
        # =====================================
        cur.execute(
            "DELETE FROM evidence_matches WHERE evidence_id = %s",
            (evidence_id,)
        )

        # ===============================
        # STEP 2 (OLD): MATCH PROFILES
        # ===============================
        cur.execute("""
            SELECT p.id, p.sample_id,
                   COUNT(*) FILTER (
                     WHERE
                       (pg.allele1 = ev.allele1 OR pg.allele1 = ev.allele2
                        OR
                        pg.allele2 = ev.allele1 OR pg.allele2 = ev.allele2)
                   ) AS matched_loci,
                   COUNT(*) AS total_loci
            FROM profiles p
            JOIN profile_genotypes pg ON pg.profile_id = p.id
            JOIN evidence_genotypes ev
              ON ev.locus_id = pg.locus_id
             AND ev.evidence_id = %s
            WHERE pg.locus_id = ANY(%s)
            GROUP BY p.id, p.sample_id
            ORDER BY matched_loci DESC
            LIMIT %s
        """, (evidence_id, loci_ids, top))

        rows = cur.fetchall()
        results = []

        # =====================================
        # STEP 3 (OLD + FIXED)
        # =====================================
        for pid, sid, matched, total in rows:

            # 🔧 FIX 2: ignore zero matches
            if matched == 0:
                continue

            score = matched / total if total else 0

            # SAVE MATCH
            cur.execute("""
                INSERT INTO evidence_matches
                (id, evidence_id, profile_id, score, matched_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                str(uuid.uuid4()),
                evidence_id,
                pid,
                round(score, 6),
                datetime.datetime.utcnow()
            ))

            results.append({
                "profile_id": str(pid),
                "sample_id": sid,
                "matched_loci": int(matched),
                "total_loci": int(total),
                "score": round(score, 3)
            })

        conn.commit()

        return {
            "evidence_id": evidence_id,
            "type": "partial",
            "saved_matches": len(results),
            "results": results
        }