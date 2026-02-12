# File Path Fix - Forensic DNA API

## Issue Summary

When uploading feedback files, the database was storing absolute filesystem paths instead of relative URL paths.

**Example of corrupted path:**
```
D:/forensic-dna-fastapi-devops/data/uploads/privacy/4cd4d8e6-90d1-4f89-85b8-e86767590bcf.png
```

**Should be:**
```
/uploads/privacy/4cd4d8e6-90d1-4f89-85b8-e86767590bcf.png
```

When the frontend tried to access the image, it would construct a URL like:
```
http://localhost:8000/uploads/privacy/D:/forensic-dna-fastapi-devops/data/uploads/privacy/...
```

This resulted in "detail not found" errors because the file path was invalid.

## Root Cause

The issue was in how the upload directory was being determined:

1. **Old code** used an absolute Docker path: `BASE_UPLOAD_DIR = "/app/data/uploads"`
2. On Windows (where the code was running), this path doesn't resolve correctly
3. File operations on mismatched paths caused database corruption
4. The wrong path got stored in the database instead of the relative URL path

## Fix Applied

### Changes to `api/routers/feedback.py`

Updated the upload directory detection to work on both Docker and local development:

```python
def get_upload_dir():
    # In Docker, use /app/data/uploads/privacy
    docker_path = Path("/app/data/uploads/privacy")
    if docker_path.parent.exists() or os.environ.get("DOCKER_ENV"):
        return str(docker_path)
    
    # Locally, use relative path: data/uploads/privacy
    local_path = Path(__file__).parent.parent.parent / "data" / "uploads" / "privacy"
    return str(local_path)
```

### Changes to `api/main.py`

Updated the static files mounting to use the same adaptive path detection:

```python
def get_uploads_directory():
    """Get the uploads directory path based on environment."""
    docker_path = Path("/app/data/uploads")
    if docker_path.exists() or os.environ.get("DOCKER_ENV"):
        return "/app/data/uploads"
    
    # Local development path
    local_path = Path(__file__).parent.parent / "data" / "uploads"
    local_path.mkdir(parents=True, exist_ok=True)
    return str(local_path)
```

## Fixing Existing Data

If you have existing feedback records with corrupted paths, run one of these scripts:

### Option 1: Python Script (Recommended)

```bash
python scripts/fix_feedback_paths.py
```

This script will:
- Scan for corrupted paths
- Extract the filename from each corrupted path
- Update the database with correct paths
- Show you before/after values

### Option 2: SQL Script

Execute the SQL script directly on your database:

```bash
# For PostgreSQL
psql -U your_user -d your_database -f scripts/fix_feedback_paths.sql

# For MySQL
mysql -u your_user -p your_database < scripts/fix_feedback_paths.sql
```

## Verification

After applying the fix, verify that:

1. ✅ New uploads store the correct URL path format: `/uploads/privacy/{file_id}`
2. ✅ Old records have been updated with correct paths
3. ✅ Image links in the admin feedback page work correctly
4. ✅ No 404 errors when viewing attachments

## File Paths After Fix

- **Docker**: Files stored at `/app/data/uploads/privacy/`
- **Local development**: Files stored at `data/uploads/privacy/` (relative to project root)
- **Database**: Always stores `/uploads/privacy/{file_id}` (relative URL path)
- **Frontend**: Accesses files at `http://localhost:8000/uploads/privacy/{file_id}`
