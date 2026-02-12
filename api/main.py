# from fastapi.middleware.cors import CORSMiddleware
# from fastapi import FastAPI
# from .routers import populations, loci, profiles, evidence, matches, auth

# app = FastAPI(title="Privacy-Aware Forensic DNA API")

# # ✅ register all routers
# app.include_router(auth.router)        # 🔑 LOGIN / JWT
# app.include_router(populations.router)
# app.include_router(loci.router)
# app.include_router(profiles.router)
# app.include_router(evidence.router)
# app.include_router(matches.router)

# @app.get("/")
# def root():
#     return {"ok": True, "service": "dna-api"}



# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from .routers import populations, loci, profiles, evidence, matches, auth

# app = FastAPI(title="Privacy-Aware Forensic DNA API")

# # ✅ ENABLE CORS (for React frontend)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ✅ register all routers
# app.include_router(auth.router)        # 🔑 LOGIN / JWT
# app.include_router(populations.router)
# app.include_router(loci.router)
# app.include_router(profiles.router)
# app.include_router(evidence.router)
# app.include_router(matches.router)

# @app.get("/")
# def root():
#     return {"ok": True, "service": "dna-api"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles



from .routers import (
    auth,
    populations,
    loci,
    profiles,
    evidence,
    matches,
    feedback,
)

app = FastAPI(
    title="Privacy-Aware Forensic DNA API",
    version="1.0.0",
)

app.mount("/uploads", StaticFiles(directory="data/uploads"), name="uploads")


# =========================
# ✅ CORS CONFIGURATION
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ✅ ROUTERS
# =========================
app.include_router(auth.router)          # 🔑 Authentication / JWT  remove foe now because we get problem by this 
app.include_router(populations.router)   # 🌍 Population data
app.include_router(loci.router)           # 🧬 STR loci
app.include_router(profiles.router)       # 👤 DNA profiles
app.include_router(evidence.router)       # 🧾 Evidence submission
app.include_router(matches.router)        # 🔍 Matching engine
app.include_router(feedback.router)

# =========================
# ✅ ROOT HEALTH CHECK
# =========================
@app.get("/")
def root():
    return {
        "ok": True,
        "service": "dna-api",
        "message": "Privacy-Aware Forensic DNA API is running"
    }
