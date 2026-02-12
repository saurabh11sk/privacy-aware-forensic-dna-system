// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";
// import "../styles/login.css";


// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [category, setCategory] = useState("admin");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     // 🔒 User is future-ready, backend not enabled yet
//     if (category === "user") {
//       setError("User access will be enabled in a future phase.");
//       return;
//     }

//     try {
//       const res = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       const { access_token, role } = res.data;

//       localStorage.setItem("token", access_token);
//       localStorage.setItem("role", role);

//       if (role === "admin") {
//         navigate("/admin");
//       } else if (role === "user") {
//         navigate("/user");
//       } else {
//         setError("Unknown role");
//       }
//     } catch (err) {
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "100px auto", fontFamily: "Arial" }}>
//       <h2>Login</h2>

//       <form onSubmit={handleLogin}>
//         <label>Login as</label>
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           style={{ width: "100%", padding: 8, marginBottom: 10 }}
//         >
//           <option value="admin">Authenticated Person</option>
//           <option value="user">User (Coming Soon)</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: "100%", padding: 8, marginBottom: 10 }}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: "100%", padding: 8, marginBottom: 10 }}
//         />

//         <button style={{ width: "100%", padding: 10 }}>
//           Login
//         </button>

//         {error && (
//           <p style={{ color: "red", marginTop: 10 }}>{error}</p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/login.css";   // ✅ IMPORTANT

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (category === "user") {
      setError("User access will be enabled in a future phase.");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { access_token, role } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      // if (role === "admin") navigate("/admin");
      // else if (role === "user") navigate("/user");
      // else setError("Unknown role");
      // if (role === "admin") {
      //     navigate("/admin");
      //   } else if (role === "investigator") {
      //     navigate("/admin");  // same dashboard for now
      //   } else if (role === "field") {
      //     navigate("/admin");  // same dashboard for now
      //   } else {
      //     setError("Unknown role");
      //   }
      if (["admin", "investigator", "field"].includes(role)) {
            navigate("/dashboard");
          } else {
            setError("Unknown role");
          }


    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="overlay"></div>
        <div className="left-content">
          <h1>
            Privacy-Aware <br />
            Forensic DNA <br />
            Matching System
          </h1>
          <p>
            Secure, ethical, and confidential STR-based forensic
            DNA evidence analysis platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <h2>Login to your account</h2>

          <form onSubmit={handleLogin}>
            <label>Login as</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="admin">Authenticated Person</option>
              <option value="user">User (Coming Soon)</option>
            </select>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            {error && <p className="error">{error}</p>}
          </form>

          <p className="security-note">
            Authorized forensic personnel only.<br />
            All access is logged for forensic integrity.
          </p>
        </div>

        <footer className="login-footer">
          For academic and research purposes only
        </footer>
      </div>
    </div>
  );
}

export default Login;
