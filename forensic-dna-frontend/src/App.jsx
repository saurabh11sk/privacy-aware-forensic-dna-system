// import { useEffect } from "react";
// import api from "./api/api";

// function App() {
//   useEffect(() => {
//     api.get("/loci")
//       .then((res) => {
//         console.log("API connected successfully:", res.data);
//       })
//       .catch((err) => {
//         console.error("API connection error:", err);
//       });
//   }, []);

//   return (
//     <div style={{ padding: "40px", fontFamily: "Arial" }}>
//       <h1>Privacy-Aware Forensic DNA Matching System</h1>
//       <p>Open browser console to check API connection.</p>
//     </div>
//   );
// }

// export default App;

// function App() {
//   return (
//     <div style={{ padding: "40px", fontFamily: "Arial" }}>
//       <h1>Privacy-Aware Forensic DNA Matching System</h1>
//       <p>Welcome. Please log in to continue.</p>
//     </div>
//   );
// }

// export default App;


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/user" element={<UserDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import EvidenceList from "./pages/EvidenceList";
import SubmitEvidence from "./pages/SubmitEvidence";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EvidenceDetail from "./pages/EvidenceDetail";
import EvidenceReport from "./pages/EvidenceReport";
import DNADetails from "./pages/DNADetails";
import MatchingDetails from "./pages/MatchingDetails";
import PrivacyDetails from "./pages/PrivacyDetails";
import AdminFeedback from "./pages/AdminFeedback";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* 🔐 Admin-only route */}
        {/* <Route
          path="/admin"
          element={
            // <ProtectedRoute allowedRole="admin">
            <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            /> */}



        {/* 🔐 User route (future-ready) */}
        {/* <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/submit-evidence"
          element={
            // <ProtectedRoute allowedRole="admin">
            <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

              <SubmitEvidence />
            </ProtectedRoute>
          }
        />

        <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


{/* 
        <Route
        path="/evidence"
        element={
          // <ProtectedRoute allowedRole="admin">
          <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

            <EvidenceList />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/evidence"
        element={
          <ProtectedRoute allowedRoles={["admin", "investigator"]}>
            <EvidenceList />
          </ProtectedRoute>
        }
      />




      <Route
        path="/evidence/:id"
        element={
          // <ProtectedRoute allowedRole="admin">
          <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

            <EvidenceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evidence/:id/report"
        element={
          // <ProtectedRoute allowedRole="admin">
          <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

            <EvidenceReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge/dna"
        element={
          // <ProtectedRoute allowedRole="admin">
          <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

            <DNADetails />
          </ProtectedRoute>
        }
      />

      {/* <Route path="/matching-details" element={<MatchingDetails />} />
      <Route path="/privacy-details" element={<PrivacyDetails />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} /> */}

      <Route
          path="/matching-details"
          element={
            // <ProtectedRoute allowedRole="admin">
            <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

              <MatchingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy-details"
          element={
            // <ProtectedRoute allowedRole="admin">
            <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

              <PrivacyDetails />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/admin/feedback"
          element={
            // <ProtectedRoute allowedRole="admin">
            <ProtectedRoute allowedRoles={["admin", "investigator", "field"]}>

              <AdminFeedback />
            </ProtectedRoute>
          }
        /> */}

        <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFeedback />
              </ProtectedRoute>
            }
          />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
