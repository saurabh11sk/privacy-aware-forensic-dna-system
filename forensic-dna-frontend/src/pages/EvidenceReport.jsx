import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import LogoutButton from "../components/LogoutButton";

function EvidenceReport() {
  const { id } = useParams();
  const [evidence, setEvidence] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.get(`/evidence/${id}`).then(res => setEvidence(res.data));
    api.get(`/matches/partial/${id}`).then(res => setMatches(res.data.items || []));
  }, [id]);

  const interpretScoreText = (score) => {
    if (score >= 0.9)
      return "Very strong genetic similarity observed. High likelihood of identity match.";
    if (score >= 0.7)
      return "Probable genetic match. Further verification recommended.";
    if (score >= 0.5)
      return "Weak genetic similarity. Partial match only.";
    return "Very weak similarity. Match is unlikely.";
  };

  if (!evidence) return <p style={{ padding: 40 }}>Loading report...</p>;

  const topMatch = matches.length > 0 ? matches[0] : null;
        const downloadReport = () => {
        window.print();
      };


  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <LogoutButton />
      <button
        onClick={downloadReport}
        style={{
          padding: "8px 12px",
          marginBottom: 20,
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Download / Print Report
      </button>


      <h1>Forensic DNA Match Report</h1>

      <hr />

      <h3>Evidence Information</h3>
      <p><b>Evidence Code:</b> {evidence.evidence_code}</p>
      <p><b>Submitted At:</b> {evidence.received_at}</p>

      <h3>STR Profile Summary</h3>
      <ul>
        {evidence.genotypes.map((g, i) => (
          <li key={i}>
            {g.locus}: {g.allele1}, {g.allele2}
          </li>
        ))}
      </ul>

      <h3>DNA Matching Result</h3>

      {topMatch ? (
        <>
          <p><b>Top Matching Profile:</b> {topMatch.profile_id}</p>
          <p><b>Match Score:</b> {topMatch.score.toFixed(3)}</p>

          <h4>Interpretation</h4>
          <p>{interpretScoreText(topMatch.score)}</p>
        </>
      ) : (
        <p>No significant DNA matches were found for this evidence.</p>
      )}

      <hr />

      <h4>Conclusion</h4>
      <p>
        This report summarizes the genetic comparison between the submitted
        forensic evidence and stored DNA profiles. Match scores are derived
        using STR locus comparison and interpreted to assist forensic decision-making.
      </p>
    </div>
  );
}

export default EvidenceReport;
