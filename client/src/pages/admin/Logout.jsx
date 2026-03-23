import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();

  useEffect(() => {
    // Clear data (localStorage)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h4>Logging out...</h4>
    </div>
  );
}

export default Logout;



