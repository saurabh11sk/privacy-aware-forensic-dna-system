// function AdminDashboard() {
//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Authenticated Person Dashboard</h1>
//       <p>Welcome. You have full system access.</p>
//     </div>
//   );
// }

// export default AdminDashboard;


// import { Link } from "react-router-dom";

// function AdminDashboard() {
//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Authenticated Person Dashboard</h1>

//       <ul>
//         <li>
//             <Link to="/submit-evidence">Submit DNA Evidence</Link>
//         </li>
//         <li>
//             <Link to="/evidence">View Evidence</Link>
//         </li>
//         </ul>

//     </div>
//   );
// }

// export default AdminDashboard;


// import { Link } from "react-router-dom";
// import LogoutButton from "../components/LogoutButton";

// function AdminDashboard() {
//   return (
//     <div style={{ padding: 40 }}>
//       <LogoutButton />

//       <h1>Authenticated Person Dashboard</h1>

//       <ul>
//         <li>
//           <Link to="/submit-evidence">Submit DNA Evidence</Link>
//         </li>
//         <li>
//           <Link to="/evidence">View Evidence</Link>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default AdminDashboard;

import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import LogoutButton from "../components/LogoutButton";
import { useEffect, useState } from "react";
import api from "../api/api";
// import KnowledgeSection from "../components/KnowledgeSection";



function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");


  const [total, setTotal] = useState(0);
  const [matched, setMatched] = useState(0);
  const [pending, setPending] = useState(0);
  // const res = await api.get("/evidence");
  // console.log("EVIDENCE API:", res.data); this casue error this is not outside  useeffect 
        useEffect(() => {
          const loadStats = async () => {
            try {
              const res = await api.get("/evidence");
              console.log("EVIDENCE API:", res.data);

              const items =
                res.data.items ||
                res.data.data ||
                (Array.isArray(res.data) ? res.data : []);

              setTotal(items.length);

              let matchedCount = 0;
              let pendingCount = 0;

              items.forEach((e) => {
                if (e.match_found === true || e.is_matched === true) {
                  matchedCount++;
                } else {
                  pendingCount++;
                }
              });

              setMatched(matchedCount);
              setPending(pendingCount);
            } catch (err) {
              console.error("Failed to load dashboard stats", err);
            }
          };

          loadStats();
        }, []);




  return (
    <div className="admin-page">
      

      {/* ===== TOP HEADER ===== */}
      <header className="admin-header">
        <div className="header-left">
          <span className="system-name">
            Privacy-Aware Forensic DNA System
          </span>
          <span className="page-title">Dashboard</span>
        </div>

        <div className="header-right">
          {/* <span className="user-role">
            Authenticated Person
          </span> */}
          <span className="user-role">
            {role?.toUpperCase()}
          </span>

          <LogoutButton />
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">

        {/* ===== WELCOME SECTION ===== */}
        <section className="dashboard-welcome">
          <h1>Welcome to the Forensic DNA Dashboard</h1>
          <p>
            This dashboard allows authorized forensic personnel to securely
            submit DNA evidence, perform matching, and review forensic reports
            while preserving genetic privacy and audit integrity.
          </p>
        </section>

        {/* ===== SUMMARY CARDS ===== */}
        <section className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Evidence</h3>
            <p className="card-value">{total}</p>

          </div>

          <div className="dashboard-card">
            <h3>Matched Evidence</h3>
            <p className="card-value">{matched}</p>

          </div>

          <div className="dashboard-card">
            <h3>Pending / Unmatched</h3>
            <p className="card-value">{pending}</p>

          </div>

          <div className="dashboard-card">
            <h3>System Status</h3>
            <p className="card-value status-ok">Operational</p>
          </div>

        </section>

        {/* ===== PRIMARY ACTIONS (STEP 4) ===== */}
        <section className="dashboard-actions">
          <h2 className="actions-title">Primary Actions</h2>

          <div className="action-cards">

            {/* <div
              className="action-card"
              onClick={() => navigate("/submit-evidence")}
            >
              <h3>Submit DNA Evidence</h3>
              <p>
                Securely submit new DNA evidence samples for forensic analysis
                and matching using the privacy-aware STR comparison system.
              </p>
            </div> */}
            {(role === "admin" || role === "field") && (
              <div
                className="action-card"
                onClick={() => navigate("/submit-evidence")}
              >
                <h3>Submit DNA Evidence</h3>
                <p>
                  Securely submit new DNA evidence samples for forensic analysis.
                </p>
              </div>
            )}


            {/* <div
              className="action-card"
              onClick={() => navigate("/evidence")}
            >
              <h3>View Evidence List</h3>
              <p>
                Browse, review, and manage submitted DNA evidence, perform
                matching, and generate forensic reports.
              </p>
            </div> */}
            {(role === "admin" || role === "investigator") && (
              <div
                className="action-card"
                onClick={() => navigate("/evidence")}
              >
                <h3>View Evidence List</h3>
                <p>
                  Browse and analyze submitted DNA evidence.
                </p>
              </div>
            )}


          </div>
        </section>
        {/* ===== KNOWLEDGE & REFERENCES SECTION ===== */}
        <section className="dashboard-knowledge">
          <h2 className="knowledge-title">Knowledge & References</h2>

          <div className="knowledge-cards">

            <div className="knowledge-card">
              <h3>DNA Basics</h3>
              <p>
                Learn what DNA is, how genetic markers work, and why DNA is a
                reliable identifier in forensic science.
              </p>
              <button
                  className="knowledge-btn"
                  onClick={() => navigate("/knowledge/dna")}
                >
                  Explore DNA
                </button>

            </div>

            <div className="knowledge-card">
              <h3>Forensic DNA Matching</h3>
              <p>
                Understand STR profiling, locus comparison, and how match
                confidence is calculated in this system.
              </p>
              <button className="knowledge-btn"
              onClick={() => navigate("/matching-details")}
>
                Explore Matching
              </button>
            </div>

            <div className="knowledge-card">
              <h3>Privacy & Ethics</h3>
              <p>
                Learn how this system preserves genetic privacy while enabling
                lawful forensic analysis.
              </p>
              <button className="knowledge-btn"
              onClick={() => navigate("/privacy-details")}
>
                Explore Privacy
              </button>
            </div>
            <div
              className="action-card"
              onClick={() => navigate("/admin/feedback")}
            >
              <h3>Manage Feedback</h3>
              <p>
                Review and moderate user feedback submissions.
              </p>
            </div>


            {/* <div className="knowledge-card">
              <h3>Patents & Research</h3>
              <p>
                Review relevant patents, academic research papers, and upload
                official documents for reference.
              </p>
              <button className="knowledge-btn">
                Explore References
              </button>
            </div> */}

          </div>
        </section>


      </main>
    </div>
  );
}

export default AdminDashboard;

