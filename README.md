# 🧬 Privacy-Aware Forensic DNA Evidence Matching System

A full-stack forensic DNA analysis platform built using FastAPI, React (Vite), PostgreSQL, and Docker.

This system enables secure DNA evidence ingestion, STR profile matching, and privacy-aware forensic analysis with role-based authentication.

---

## 🚀 Tech Stack

Backend:
- FastAPI (Python)
- PostgreSQL
- JWT Authentication (RBAC)
- SQL Initialization Scripts

Frontend:
- React (Vite)
- Axios
- Protected Routes

DevOps:
- Docker
- Docker Compose
- Environment Variables
- Data Ingestion Pipelines

---

## 📁 Project Structure

privacy-aware-forensic-dna-system/
├── api/                     # FastAPI backend
├── forensic-dna-frontend/   # React frontend
├── infra/                   # Docker & infrastructure
├── scripts/                 # Data ingestion scripts
├── data/                    # Dataset files
└── README.md

---

## ⚙️ How to Run

Clone the repository:

git clone https://github.com/saurabh11sk/privacy-aware-forensic-dna-system.git
cd privacy-aware-forensic-dna-system

Start with Docker:

docker-compose up --build

Services:
- Backend API → http://localhost:8000
- Swagger Docs → http://localhost:8000/docs
- Frontend → http://localhost:5173

---

## 🔐 Authentication

POST /auth/login

Example:
{
  "email": "admin",
  "password": "admin"
}

Returns JWT token for authorized access.

---

## 🧪 Core Features

- Evidence submission
- STR profile ingestion
- DNA match comparison
- Exportable match reports
- Role-based access control
- Feedback module
- Secure API endpoints

---

## 🛠 DevOps Highlights

- Fully Dockerized backend & database
- PostgreSQL containerized setup
- SQL initialization scripts
- Environment-based configuration
- One-command startup
- Clean monorepo architecture

---

## 📌 Future Improvements

- Advanced statistical match probability
- Case management dashboard
- Audit logs
- Cloud deployment (AWS / Azure)
- CI/CD integration

---

## 👤 Author

Saurabh Gupta  
GitHub: https://github.com/saurabh11sk
