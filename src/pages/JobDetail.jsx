import { useParams, Link, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { jobs } = useJobs();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Job not found</h2>
        <p className="text-gray-400 text-sm mb-6">This listing may have been removed.</p>
        <Link to="/jobs" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    if (!user) navigate("/login");
    else if (user.role === "employer") alert("Employers cannot apply for jobs.");
    else navigate(`/apply/${job.id}`);
  };

  const relatedJobs = jobs.filter((j) => j.type === job.type && j.id !== job.id).slice(0, 2);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">

        {/* ── Main ── */}
        <div className="flex-1">
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
            ← Back to listings
          </Link>

          {/* Header Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3
                  ${job.type === "Remote"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : job.type === "Contract"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                  }`}>
                  {job.type}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{job.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{job.company}</p>
              </div>
              <button
                onClick={handleApply}
                className="shrink-0 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
            <div className="flex flex-wrap gap-5 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
              <span>🗓️ Posted on {new Date(job.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">About the Role</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.requirements.map((req) => (
                <span key={req} className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1.5 rounded-lg">
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">What to Expect</h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {["Competitive salary and performance bonuses", "Flexible working hours and hybrid/remote options", "Health insurance and wellness benefits", "Learning budget for courses and conferences", "Collaborative team with regular feedback cycles"].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-5">

          {/* Quick Apply */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Ready to apply?</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Takes less than 5 minutes.</p>
            <button
              onClick={handleApply}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors mb-2"
            >
              Apply Now
            </button>
            <Link to="/jobs" className="block text-center text-sm text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1">
              Browse more jobs
            </Link>
          </div>

          {/* Company Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">About {job.company}</h3>
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              {[["Industry", "Technology"], ["Company size", "201–500 employees"], ["Headquarters", job.location], ["Type", "Private"]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-500">{k}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Similar Jobs</h3>
              <div className="flex flex-col gap-3">
                {relatedJobs.map((r) => (
                  <Link key={r.id} to={`/jobs/${r.id}`} className="group block">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{r.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{r.company} · {r.location}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}