import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children, role }) {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  useEffect(() => {
    if (!user) {
      // Save the page they tried to visit
      navigate("/login", { state: { from: location.pathname }, replace: true });
    } else if (role && user.role !== role) {
      // Wrong role — send to their own dashboard
      navigate(
        user.role === "employer" ? "/dashboard/employer" : "/dashboard/seeker",
        { replace: true }
      );
    }
  }, [user, role, navigate, location]);

  if (!user) return null;
  if (role && user.role !== role) return null;

  return children;
}