import os
import psycopg

DNA_DB_URI = os.getenv(
    "DNA_DB_URI",
    "postgresql://dna_admin:dna_admin@db:5432/dna_forensics"
)

def get_conn():
    return psycopg.connect(DNA_DB_URI)