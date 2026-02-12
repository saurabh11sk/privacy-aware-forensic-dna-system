#!/usr/bin/env python3
"""
Fix corrupted feedback file paths in the database.

This script updates any feedback records that have absolute file system paths
instead of relative URL paths. For example:
  BEFORE: D:/forensic-dna-fastapi-devops/data/uploads/privacy/4cd4d8e6.png
  AFTER:  /uploads/privacy/4cd4d8e6.png
"""

import sys
import os
import re
from pathlib import Path

# Add parent directory to path to import from api module
sys.path.insert(0, str(Path(__file__).parent.parent))

from api.db import get_conn


def fix_file_paths():
    """Fix corrupted file paths in the feedback table."""
    
    print("🔍 Scanning for corrupted file paths...")
    
    with get_conn() as conn, conn.cursor() as cur:
        # Find all records with corrupted paths
        cur.execute("""
            SELECT id, file_path FROM feedback 
            WHERE file_path IS NOT NULL 
            AND (
                file_path LIKE 'D:%' OR 
                file_path LIKE 'C:%' OR 
                file_path LIKE 'E:%' OR
                file_path LIKE '%data/uploads/privacy%'
            )
        """)
        
        corrupted_records = cur.fetchall()
        
        if not corrupted_records:
            print("✅ No corrupted paths found!")
            return
        
        print(f"⚠️  Found {len(corrupted_records)} corrupted path(s)")
        
        fixes_applied = 0
        
        for record_id, file_path in corrupted_records:
            print(f"\n  ID: {record_id}")
            print(f"  OLD: {file_path}")
            
            # Extract the filename (UUID with extension) from the corrupted path
            # Looking for pattern like: 4cd4d8e6-90d1-4f89-85b8-e86767590bcf.png
            match = re.search(r'([a-f0-9\-]+\.(png|jpg|jpeg|pdf))', file_path, re.IGNORECASE)
            
            if match:
                filename = match.group(1)
                new_path = f"/uploads/privacy/{filename}"
                print(f"  NEW: {new_path}")
                
                # Update the database
                cur.execute(
                    "UPDATE feedback SET file_path = %s WHERE id = %s",
                    (new_path, record_id)
                )
                fixes_applied += 1
            else:
                print(f"  ⚠️  Could not extract filename, skipping")
        
        # Commit all changes
        if fixes_applied > 0:
            conn.commit()
            print(f"\n✅ Successfully fixed {fixes_applied} record(s)")
        else:
            print("\n❌ No records could be fixed")


if __name__ == "__main__":
    try:
        fix_file_paths()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
