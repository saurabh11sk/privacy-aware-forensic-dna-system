import datetime
import json

from typing import Optional, Dict, Any

def write_audit(
    cur,
    action: str,
    entity: str,
    entity_id: str,
    details: Optional[Dict[str, Any]] = None
):
    cur.execute("""
        INSERT INTO audit_logs (action, entity, entity_id, details, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        action,
        entity,
        entity_id,
        json.dumps(details) if details else None,
        datetime.datetime.utcnow()
    ))