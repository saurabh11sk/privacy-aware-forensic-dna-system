#!/usr/bin/env python3
import csv, os, psycopg

URI = os.getenv(
    "DNA_DB_URI",
    "postgresql://dna_admin:dna_pass@localhost:5432/dna_forensics"
)

CSV = "/app/data/combined_profiles.csv"


# 🔴 FIX 1: ensure locus exists (NEW FUNCTION)
def ensure_locus(cur, locus):
    cur.execute(
        "INSERT INTO str_loci(locus) VALUES(%s) "
        "ON CONFLICT (locus) DO NOTHING RETURNING id",
        (locus,)
    )
    row = cur.fetchone()
    if row:
        return row[0]

    cur.execute("SELECT id FROM str_loci WHERE locus=%s", (locus,))
    return cur.fetchone()[0]


def ensure_population(cur, pop_name):
    cur.execute("SELECT id FROM populations WHERE name=%s", (pop_name,))
    row = cur.fetchone()
    if row:
        return row[0]

    cur.execute(
        "INSERT INTO populations(name) VALUES(%s) RETURNING id",
        (pop_name,)
    )
    return cur.fetchone()[0]


def get_alleles(row, locus):
    combined_key = locus
    a1_key, a2_key = f"{locus}_A1", f"{locus}_A2"

    if combined_key in row and row[combined_key]:
        cell = row[combined_key].strip()
        if "," in cell:
            return [x.strip() for x in cell.split(",", 1)]

    if a1_key in row and a2_key in row:
        return row[a1_key].strip(), row[a2_key].strip()

    return None


with psycopg.connect(URI) as conn, conn.cursor() as cur, open(CSV, newline="") as f:
    reader = csv.DictReader(f)

    # strip BOM
    if reader.fieldnames and reader.fieldnames[0].startswith("\ufeff"):
        reader.fieldnames[0] = reader.fieldnames[0].lstrip("\ufeff")

    # 🔴 FIX 2: detect loci from CSV columns
    loci = {}
    for col in reader.fieldnames:
        if col not in ("SampleID", "Population"):
            loci[col] = ensure_locus(cur, col)
    # 🔴 now str_loci is auto-populated

    profiles_cnt = 0
    genos_cnt = 0

    for row in reader:
        sample = row["SampleID"].strip()
        pop_name = row["Population"].strip()
        pop_id = ensure_population(cur, pop_name)

        cur.execute("""
            INSERT INTO profiles(sample_id, population_id)
            VALUES (%s,%s)
            ON CONFLICT(sample_id)
            DO UPDATE SET population_id = EXCLUDED.population_id
            RETURNING id
        """, (sample, pop_id))

        profile_id = cur.fetchone()[0]
        profiles_cnt += 1

        # insert genotypes
        for locus, locus_id in loci.items():
            alleles = get_alleles(row, locus)
            if not alleles:
                continue

            a1, a2 = alleles
            cur.execute("""
                INSERT INTO profile_genotypes(profile_id, locus_id, allele1, allele2)
                VALUES (%s,%s,%s,%s)
                ON CONFLICT (profile_id, locus_id)
                DO UPDATE SET allele1=EXCLUDED.allele1,
                              allele2=EXCLUDED.allele2
            """, (profile_id, locus_id, a1, a2))
            genos_cnt += 1

    conn.commit()
    print(f"Ingestion complete. Profiles: {profiles_cnt}, genotype rows: {genos_cnt}")