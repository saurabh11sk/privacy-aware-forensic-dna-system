import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 12px",
        backgroundColor: "#c0392b",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        float: "right"
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
