import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";
import { useApplications } from "../context/ApplicationContext";

const STATUS_OPTIONS = ["Applied", "Reviewing", "Shortlisted", "Rejected", "Hired"];

const STATUS_STYLES = {
  Applied:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Reviewing:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Shortlisted: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  Rejected:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Hired:       "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
};

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { jobs, deleteJob } = useJobs();
  const { applications, updateStatus } = useApplications();
  const [expandedJob, setExpandedJob]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!user) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Login required</h2>
      <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Go to Login</Link>
    </div>
  );

  if (user.role !== "employer") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🚫</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Employers only</h2>
      <Link to="/dashboard/seeker" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Go to Seeker Dashboard</Link>
    </div>
  );

  const myJobs = jobs.filter((j) => j.employerId === user.id);
  const totalApplications = applications.filter((a) => myJobs.some((j) => j.id === a.jobId)).length;

  const stats = [
    { label: "Active Listings",  value: myJobs.length,       color: "text-indigo-600 dark:text-indigo-400" },
    { label: "Total Applicants", value: totalApplications,   color: "text-blue-600 dark:text-blue-400"    },
    { label: "Shortlisted",      value: applications.filter((a) => myJobs.some((j) => j.id === a.jobId) && a.status === "Shortlisted").length, color: "text-purple-600 dark:text-purple-400" },
    { label: "Hired",            value: applications.filter((a) => myJobs.some((j) => j.id === a.jobId) && a.status === "Hired").length,       color: "text-green-600 dark:text-green-400"  },
  ];

  const handleDelete = (jobId) => { deleteJob(jobId); setConfirmDelete(null); if (expandedJob === jobId) setExpandedJob(null); };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employer Dashboard</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
              Welcome back, <span className="text-gray-600 dark:text-gray-300 font-medium">{user.name}</span>
            </p>
          </div>
          <Link to="/post-job" className="self-start sm:self-auto bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            + Post a Job
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

        {/* Jobs */}
        {myJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
            <p className="text-5xl mb-4">📋</p>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">No jobs posted yet</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Post your first job and start receiving applications.</p>
            <Link to="/post-job" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Post a Job</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myJobs.map((job) => {
              const jobApps = applications.filter((a) => a.jobId === job.id);
              const isExpanded = expandedJob === job.id;

              return (
                <div key={job.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{job.title}</h3>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                            ${job.type === "Remote" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : job.type === "Contract" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"}`}>
                            {job.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{job.company} · {job.location} · {job.salary}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.requirements.slice(0, 4).map((r) => (
                            <span key={r} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                          className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                          👥 {jobApps.length} {jobApps.length === 1 ? "Applicant" : "Applicants"}
                          <span className="text-xs">{isExpanded ? "▲" : "▼"}</span>
                        </button>
                        <Link to={`/jobs/${job.id}`} className="text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          View
                        </Link>
                        <button onClick={() => setConfirmDelete(job.id)} className="text-sm text-red-400 border border-red-100 dark:border-red-900/40 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                      Posted {new Date(job.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {/* Applicants Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-5">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Applicants for {job.title}</h4>
                      {jobApps.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No applications yet.</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {jobApps.map((app) => (
                            <div key={app.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium text-gray-800 dark:text-white">{app.fullName}</p>
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[app.status] || "bg-gray-100 text-gray-600"}`}>
                                    {app.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-gray-400 dark:text-gray-500">
                                  <span>✉️ {app.email}</span>
                                  <span>📞 {app.phone}</span>
                                  <span>🎓 {app.experience}</span>
                                </div>
                                {app.coverLetter && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-1">{app.coverLetter}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {app.resumeUrl && (
                                  <a href={app.resumeUrl} target="_blank" rel="noreferrer"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors">
                                    Resume ↗
                                  </a>
                                )}
                                <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}
                                  className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">Delete this job?</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">This will remove the listing and all its applications permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Yes, Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}