// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/api";
// import { Link } from "react-router-dom";


// function EvidenceDetail() {
//   const { id } = useParams();
//   const [evidence, setEvidence] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const interpretScore = (score) => {
//   if (score >= 0.9) return { label: "Very Strong Match", color: "green" };
//   if (score >= 0.7) return { label: "Probable Match", color: "orange" };
//   if (score >= 0.5) return { label: "Weak Match", color: "brown" };
//   return { label: "Very Weak / Partial", color: "gray" };
// };

//   // Fetch evidence by ID
//   useEffect(() => {
//     api.get(`/evidence/${id}`)
//       .then(res => setEvidence(res.data))
//       .catch(() => setError("Failed to load evidence"));
//   }, [id]);

//   // Run DNA matching
//   const runMatching = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get(`/matches/partial/${id}`);
//       setMatches(res.data.items || []);
//     } catch {
//       setError("DNA matching failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!evidence) return <p style={{ padding: 40 }}>Loading...</p>;

//   return (
//     <div style={{ padding: 40 }}>
//       <h2>Evidence Detail</h2>

//       <p><b>Evidence Code:</b> {evidence.evidence_code}</p>
//       <p><b>Submitted At:</b> {evidence.received_at}</p>

//       <h3>STR Genotypes</h3>
//       <ul>
//         {evidence.genotypes.map((g, i) => (
//           <li key={i}>
//             {g.locus}: {g.allele1}, {g.allele2}
//           </li>
//         ))}
//       </ul>

//       <button onClick={runMatching} style={{ marginTop: 20, padding: 10 }}>
//         Run DNA Matching
//       </button>

//       {loading && <p>Running matching...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* {matches.length > 0 && (
//         <>
//           <h3>Match Results</h3>
//           <table border="1" cellPadding="8">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Profile ID</th>
//                 <th>Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {matches.map((m, idx) => (
//                 <tr key={m.id}>
//                   <td>{idx + 1}</td>
//                   <td>{m.profile_id}</td>
//                   <td>{m.score}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )} */}
//       {matches.length > 0 && (
//             <>
//                 <h3>DNA Match Results</h3>

//                 <table
//                 border="1"
//                 cellPadding="10"
//                 style={{ borderCollapse: "collapse", marginTop: 10 }}
//                 >
//                 <thead>
//                     <tr>
//                     <th>Rank</th>
//                     <th>Profile ID</th>
//                     <th>Score</th>
//                     <th>Confidence</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {matches.map((m, idx) => {
//                     const confidence = interpretScore(m.score);
//                     return (
//                         <tr key={m.id}>
//                         <td>{idx + 1}</td>
//                         <td>{m.profile_id}</td>
//                         <td>{m.score.toFixed(3)}</td>
//                         <td style={{ color: confidence.color }}>
//                             {confidence.label}
//                         </td>
//                         </tr>
//                     );
//                     })}
//                 </tbody>
//                 </table>

//                 <link
//                 to={`/evidence/${id}/report`}
//                 style={{
//                     display: "inline-block",
//                     marginTop: 20,
//                     padding: "10px 14px",
//                     backgroundColor: "#2c3e50",
//                     color: "white",
//                     textDecoration: "none",
//                     borderRadius: 4
//                 }}
//                 >
//                 View Forensic Report
//                 </link>

//             </>
//             )}
//     </div>
//   );
// }

// export default EvidenceDetail;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import LogoutButton from "../components/LogoutButton";

function EvidenceDetail() {
  const { id } = useParams();
  const [evidence, setEvidence] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchingDone, setMatchingDone] = useState(false);


  // Confidence interpretation
  const interpretScore = (score) => {
    if (score >= 0.9) return { label: "Very Strong Match", color: "green" };
    if (score >= 0.7) return { label: "Probable Match", color: "orange" };
    if (score >= 0.5) return { label: "Weak Match", color: "brown" };
    return { label: "Very Weak / Partial", color: "gray" };
  };

  // Fetch evidence
  useEffect(() => {
    api.get(`/evidence/${id}`)
      .then(res => setEvidence(res.data))
      .catch(() => setError("Failed to load evidence"));
  }, [id]);

  // Run matching
  const runMatching = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/matches/partial/${id}`);
      setMatches(res.data.items || []);
    } catch {
      setError("DNA matching failed");
    } finally {
      setLoading(false);
      setMatchingDone(true); // 👈 ADD THIS LINE
    }

  };

  if (!evidence) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <LogoutButton />
      <h2>Evidence Detail</h2>

      <p><b>Evidence Code:</b> {evidence.evidence_code}</p>
      <p><b>Submitted At:</b> {evidence.received_at}</p>

      <h3>STR Genotypes</h3>
      <ul>
        {evidence.genotypes.map((g, i) => (
          <li key={i}>
            {g.locus}: {g.allele1}, {g.allele2}
          </li>
        ))}
      </ul>

      <button onClick={runMatching} style={{ marginTop: 20, padding: 10 }}>
        Run DNA Matching
      </button>

      {loading && <p>Running matching...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* MATCH RESULTS */}
      {/* {matches.length > 0 && (
        <>
          <h3 style={{ marginTop: 30 }}>DNA Match Results</h3>

          <table
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse", marginTop: 10 }}
          >
            <thead>
              <tr>
                <th>Rank</th>
                <th>Profile ID</th>
                <th>Score</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, idx) => {
                const confidence = interpretScore(m.score);
                return (
                  <tr key={m.id}>
                    <td>{idx + 1}</td>
                    <td>{m.profile_id}</td>
                    <td>{m.score.toFixed(3)}</td>
                    <td style={{ color: confidence.color }}>
                      {confidence.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          
          <Link
            to={`/evidence/${id}/report`}
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "10px 14px",
              backgroundColor: "#2c3e50",
              color: "white",
              textDecoration: "none",
              borderRadius: 4
            }}
          >
            View Forensic Report
          </Link>
        </>
      )} */}
        {matchingDone && (
          <>
            {matches.length > 0 && (
              <>
                <h3>DNA Match Results</h3>

                <table
                  border="1"
                  cellPadding="10"
                  style={{ borderCollapse: "collapse", marginTop: 10 }}
                >
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Profile ID</th>
                      <th>Score</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, idx) => {
                      const confidence = interpretScore(m.score);
                      return (
                        <tr key={m.id}>
                          <td>{idx + 1}</td>
                          <td>{m.profile_id}</td>
                          <td>{m.score.toFixed(3)}</td>
                          <td style={{ color: confidence.color }}>
                            {confidence.label}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}

            {/* ✅ ALWAYS SHOW REPORT BUTTON AFTER MATCHING */}
            <Link
              to={`/evidence/${id}/report`}
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "10px 14px",
                backgroundColor: "#2c3e50",
                color: "white",
                textDecoration: "none",
                borderRadius: 4
              }}
            >
              View Forensic Report
            </Link>
          </>
        )}

    </div>
  );
}

export default EvidenceDetail;
