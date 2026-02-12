import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import LogoutButton from "../components/LogoutButton";

function EvidenceList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/evidence")
      .then(res => setItems(res.data.items))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <LogoutButton />
      <h2>Submitted Evidence</h2>

      {items.length === 0 && <p>No evidence found.</p>}

      <ul>
        {items.map(ev => (
          <li key={ev.id} style={{ marginBottom: 10 }}>
            <b>{ev.evidence_code}</b>{" "}
            <small>({ev.received_at})</small>{" "}
            <Link to={`/evidence/${ev.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EvidenceList;
