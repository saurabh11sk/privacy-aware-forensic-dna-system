#!/usr/bin/env python3
"""
ingest_frequencies.py

Loads allele frequency data (Locus, Allele, Frequency, Population)
into the allele_frequencies table.

Usage:
  source ~/forensic_dna_backend/.venv/bin/activate
  export DNA_DB_URI="postgresql://dna_admin:dna_pass@localhost:5432/dna_forensics"
  python3 ~/forensic_dna_backend/scripts/ingest_frequencies.py
"""

import os, csv, sys
import psycopg

CSV = "/app/data/combined_profiles.csv"
URI = os.getenv("DNA_DB_URI", "postgresql://dna_admin:dna_pass@localhost:5432/dna_forensics")

def get_map(cur, sql):
    cur.execute(sql)
    return {row[1]: row[0] for row in cur.fetchall()}

def ensure_locus(cur, locus):
    cur.execute("INSERT INTO str_loci(locus) VALUES (%s) ON CONFLICT (locus) DO NOTHING RETURNING id", (locus,))
    r = cur.fetchone()
    if r:
        return r[0]
    cur.execute("SELECT id FROM str_loci WHERE locus=%s", (locus,))
    return cur.fetchone()[0]

def ensure_population(cur, name):
    cur.execute("INSERT INTO populations(name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id", (name,))
    r = cur.fetchone()
    if r:
        return r[0]
    cur.execute("SELECT id FROM populations WHERE name=%s", (name,))
    return cur.fetchone()[0]

def main():
    if not os.path.exists(CSV):
        print("CSV not found:", CSV, file=sys.stderr)
        sys.exit(2)

    with psycopg.connect(URI) as conn, conn.cursor() as cur, open(CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        expected = ["Locus", "Allele", "Frequency", "Population"]
        if reader.fieldnames != expected:
            print("Unexpected CSV header. Expected:", expected, "Got:", reader.fieldnames)
            sys.exit(3)

        locus_map = get_map(cur, "SELECT id, locus FROM str_loci")
        pop_map = get_map(cur, "SELECT id, name FROM populations")

        inserted = 0
        updated = 0
        for i, row in enumerate(reader, start=1):
            locus = row["Locus"].strip()
            allele = row["Allele"].strip()
            pop = row["Population"].strip()
            try:
                freq = float(row["Frequency"])
            except ValueError:
                print(f"Skipping invalid freq on line {i}: {row['Frequency']}")
                continue

            if locus not in locus_map:
                locus_map[locus] = ensure_locus(cur, locus)
            if pop not in pop_map:
                pop_map[pop] = ensure_population(cur, pop)

            locus_id = locus_map[locus]
            pop_id = pop_map[pop]

            cur.execute("""
                INSERT INTO allele_frequencies (locus_id, allele, frequency, population_id)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (locus_id, allele, population_id)
                DO UPDATE SET frequency = EXCLUDED.frequency
                RETURNING (xmax = 0) AS inserted;
            """, (locus_id, allele, freq, pop_id))
            res = cur.fetchone()
            if res and res[0]:
                inserted += 1
            else:
                updated += 1

        conn.commit()
        print(f"Ingestion complete. Inserted: {inserted}, Updated: {updated}")

if __name__ == "__main__":
    main()
