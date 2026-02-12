import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/AdminDashboard.css";

function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedbackList(res.data);
    } catch (err) {
      console.error("Failed to load feedback", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/feedback/${id}`, { status });
      loadFeedback(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading feedback...</p>;

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h2>Feedback Management</h2>

        {feedbackList.length === 0 && <p>No feedback found.</p>}

        {feedbackList.map((fb) => (
          <div key={fb.id} className="dashboard-card" style={{ marginBottom: "15px" }}>
            <p><strong>Module:</strong> {fb.module}</p>
            <p><strong>User ID:</strong> {fb.user_id}</p>
            <p><strong>Message:</strong> {fb.message}</p>
            <p><strong>Status:</strong> {fb.status}</p>

            {fb.file_path && (
              <p>
                {/* <a href={`http://localhost:8000${fb.file_path}`} target="_blank" rel="noreferrer">
                  View Attachment
                </a> */}

                {/* <a
                    // href={`http://localhost:8000${fb.file_path}`}
                    href={fb.file_path}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    > */}
                    <a href={fb.file_path} target="_blank" rel="noopener noreferrer">
                    View Attachment
                    </a>
              </p>
            )}

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => updateStatus(fb.id, "approved")}
                style={{ marginRight: "10px" }}
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(fb.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFeedback;
