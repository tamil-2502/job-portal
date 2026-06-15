import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200">

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white text-base">{job.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.company}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full
          ${job.type === "Remote"
            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
            : job.type === "Contract"
            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
          }`}>
          {job.type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-4">
        <span>📍 {job.location}</span>
        <span>💰 {job.salary}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.requirements.slice(0, 3).map((req) => (
          <span
            key={req}
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md"
          >
            {req}
          </span>
        ))}
      </div>

      <Link
        to={`/jobs/${job.id}`}
        className="block text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg py-2 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700 transition-all duration-200"
      >
        View Details
      </Link>
    </div>
  );
}