import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate        = useNavigate();
  const location        = useLocation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const from = location.state?.from || null;

  if (user) {
    navigate(user.role === "employer" ? "/dashboard/employer" : "/dashboard/seeker");
    return null;
  }

  const handleLogin = async (role) => {
    if (!role) { setError("Please select a role to continue."); return; }
    setError("");
    setLoading(true);
    await new Promise((res) => setTimeout(res, 700));
    login(role);
    setLoading(false);
    navigate(from || (role === "employer" ? "/dashboard/employer" : "/dashboard/seeker"), { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
            Job<span className="text-gray-800 dark:text-white">Portal</span>
          </Link>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Sign in to continue</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">

          {from && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs rounded-lg px-4 py-3 mb-6">
              🔒 You need to log in to access that page.
            </div>
          )}

          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Welcome back</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-7">Choose your role to sign in.</p>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">I am a...</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { role: "seeker",   icon: "👤", label: "Job Seeker",  desc: "Browse jobs and track applications" },
              { role: "employer", icon: "🏢", label: "Employer",    desc: "Post jobs and manage applicants"    },
            ].map(({ role, icon, label, desc }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all
                  ${selectedRole === role
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">{desc}</span>
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-500 mb-4 text-center">{error}</p>}

          <button
            onClick={() => handleLogin(selectedRole)}
            disabled={loading || !selectedRole}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Signing in...</>
            ) : `Sign in as ${selectedRole ? (selectedRole === "seeker" ? "Job Seeker" : "Employer") : "..."}`}
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-5">
            This is a demo app — no real credentials needed.
          </p>
        </div>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}