import { Link } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import JobCard from "../components/JobCard";

const stats = [
  { label: "Jobs Listed",        value: "1,200+" },
  { label: "Companies Hiring",   value: "340+"   },
  { label: "Candidates Placed",  value: "8,500+" },
];

const categories = [
  { label: "Engineering", icon: "💻", count: 120 },
  { label: "Design",      icon: "🎨", count: 85  },
  { label: "Marketing",   icon: "📣", count: 60  },
  { label: "Finance",     icon: "📊", count: 45  },
  { label: "Remote",      icon: "🌍", count: 200 },
  { label: "Internships", icon: "🎓", count: 30  },
];

export default function Landing() {
  const { jobs } = useJobs();
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            India's Growing Job Network
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
            Find a job that fits <br />
            <span className="text-indigo-600 dark:text-indigo-400">your ambition</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Browse hundreds of roles across tech, design, and more. Apply in minutes, hear back faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Job title, skill, or company..."
              className="flex-1 w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <Link
              to="/jobs"
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Search Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              to="/jobs"
              key={cat.label}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{cat.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{cat.count} jobs</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Featured Jobs</h2>
          <Link to="/jobs" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* ── Employer CTA ── */}
      <section className="bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Hiring? Post a job today.</h2>
            <p className="text-indigo-200 text-sm">
              Reach thousands of qualified candidates. Free to post, easy to manage.
            </p>
          </div>
          <Link
            to="/post-job"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            Post a Job
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-800 dark:bg-gray-950 border-t border-gray-700 text-gray-400 text-sm text-center py-6">
        © 2025 JobPortal. Built with React & Tailwind CSS.
      </footer>
    </div>
  );
}