-- Fix existing feedback file paths that contain absolute filesystem paths
-- This script converts full paths like "D:/forensic-dna-fastapi-devops/data/uploads/privacy/..."
-- to relative URL paths like "/uploads/privacy/..."

-- For Windows absolute paths (starting with C:, D:, E:, etc.)
UPDATE feedback
SET file_path = CASE
    -- Extract filename from Windows paths containing /uploads/privacy/
    WHEN file_path LIKE '%/uploads/privacy/%' THEN 
        '/uploads/privacy/' || SUBSTRING(file_path, INSTR(file_path, 'uploads/privacy/') + 15)
    -- Extract filename from paths ending with valid image extensions
    WHEN file_path LIKE '%.png' OR file_path LIKE '%.jpg' OR file_path LIKE '%.jpeg' OR file_path LIKE '%.pdf' THEN
        '/uploads/privacy/' || RIGHT(file_path, 36) -- UUID is 36 chars with extension
    ELSE file_path
END
WHERE file_path IS NOT NULL
  AND (
      file_path LIKE 'D:%' OR 
      file_path LIKE 'C:%' OR 
      file_path LIKE 'E:%' OR
      file_path LIKE '%data/uploads/privacy%'
  );

-- Verify the fix - uncomment the SELECT below to see which records were updated
-- SELECT id, user_id, file_path FROM feedback WHERE file_path IS NOT NULL;
