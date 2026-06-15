import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApplications } from "../context/ApplicationContext";
import { useJobs } from "../context/JobContext";

const STATUS_STYLES = {
  Applied:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Reviewing:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Shortlisted: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  Rejected:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Hired:       "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
};

// Can only withdraw if still in Applied stage
const WITHDRAWABLE = ["Applied"];

export default function SeekerDashboard() {
  const { user } = useAuth();
  const { applications, removeApplication } = useApplications();
  const { jobs } = useJobs();
  const [confirmWithdraw, setConfirmWithdraw] = useState(null);

  if (!user) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Login required</h2>
      <p className="text-gray-400 text-sm mb-6">Please log in to view your applications.</p>
      <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Go to Login</Link>
    </div>
  );

  if (user.role !== "seeker") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🚫</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Seekers only</h2>
      <Link to="/dashboard/employer" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Employer Dashboard</Link>
    </div>
  );

  const myApplications = applications.filter((a) => a.seekerId === user.id);

  const stats = [
    { label: "Total Applied",  value: myApplications.length,                                           color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Under Review",   value: myApplications.filter((a) => a.status === "Reviewing").length,   color: "text-yellow-600 dark:text-yellow-400" },
    { label: "Shortlisted",    value: myApplications.filter((a) => a.status === "Shortlisted").length, color: "text-purple-600 dark:text-purple-400" },
    { label: "Hired",          value: myApplications.filter((a) => a.status === "Hired").length,       color: "text-green-600 dark:text-green-400"   },
  ];

  const handleWithdraw = (applicationId) => {
    removeApplication(applicationId);
    setConfirmWithdraw(null);
  };

  // The application being confirmed (for modal display)
  const withdrawTarget = myApplications.find((a) => a.id === confirmWithdraw);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
              Welcome back,{" "}
              <span className="text-gray-600 dark:text-gray-300 font-medium">{user.name}</span>
            </p>
          </div>
          <Link
            to="/jobs"
            className="self-start sm:self-auto bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse More Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Applications List */}
        {myApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">No applications yet</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Start applying to jobs and track your progress here.
            </p>
            <Link
              to="/jobs"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myApplications.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              const canWithdraw = WITHDRAWABLE.includes(app.status);

              return (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{app.jobTitle}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLES[app.status] || "bg-gray-100 text-gray-600"}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{app.company}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <span>🗓️ Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span>🎓 {app.experience}</span>
                        {job && <span>📍 {job.location}</span>}
                        {job && <span>💰 {job.salary}</span>}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {job ? (
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                          View Job
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Job removed</span>
                      )}

                      {/* Withdraw button — only if still "Applied" */}
                      {canWithdraw ? (
                        <button
                          onClick={() => setConfirmWithdraw(app.id)}
                          className="text-sm text-red-400 border border-red-100 dark:border-red-900/40 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Withdraw
                        </button>
                      ) : (
                        <span
                          title={`Cannot withdraw — application is ${app.status}`}
                          className="text-xs text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-800 px-3 py-1.5 rounded-lg cursor-not-allowed"
                        >
                          Withdraw
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  {app.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium uppercase tracking-wide">
                        Your Cover Letter
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Recommended Jobs */}
        {myApplications.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                Jobs You Haven't Applied To
              </h2>
              <Link to="/jobs" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobs
                .filter((j) => !myApplications.some((a) => a.jobId === j.id))
                .slice(0, 3)
                .map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-medium text-gray-800 dark:text-white text-sm mb-0.5">{job.title}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{job.company} · {job.location}</p>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="block text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg py-1.5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Withdraw Confirm Modal ── */}
      {confirmWithdraw && withdrawTarget && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1 text-center">
              Withdraw Application?
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-1">
              You are about to withdraw your application for
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center mb-1">
              {withdrawTarget.jobTitle}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-6">
              at {withdrawTarget.company}. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleWithdraw(confirmWithdraw)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Yes, Withdraw
              </button>
              <button
                onClick={() => setConfirmWithdraw(null)}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}