import { useState, useMemo } from "react";
import { useJobs } from "../context/JobContext";
import JobCard from "../components/JobCard";

const JOB_TYPES = ["All", "Full-time", "Remote", "Contract"];
const LOCATIONS  = ["All", "Chennai", "Bangalore", "Hyderabad", "Mumbai", "Remote"];

export default function JobListings() {
  const { jobs } = useJobs();
  const [search, setSearch]      = useState("");
  const [typeFilter, setType]    = useState("All");
  const [locationFilter, setLoc] = useState("All");
  const [sortBy, setSort]        = useState("newest");

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.requirements.some((r) => r.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "All") result = result.filter((j) => j.type === typeFilter);
    if (locationFilter !== "All") result = result.filter((j) => j.location === locationFilter);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    else result.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
    return result;
  }, [search, typeFilter, locationFilter, sortBy, jobs]);

  const clearFilters = () => { setSearch(""); setType("All"); setLoc("All"); setSort("newest"); };
  const isFiltered = search || typeFilter !== "All" || locationFilter !== "All";

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Browse Jobs</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {filtered.length} {filtered.length === 1 ? "role" : "roles"} found
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Filters</h2>
              {isFiltered && (
                <button onClick={clearFilters} className="text-xs text-indigo-500 hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Job Type
              </p>
              <div className="flex flex-col gap-1.5">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      typeFilter === t
                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Location
              </p>
              <div className="flex flex-col gap-1.5">
                {LOCATIONS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLoc(l)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      locationFilter === l
                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, skill, or company..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <select
              value={sortBy}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Filter Pills */}
          {isFiltered && (
            <div className="flex flex-wrap gap-2 mb-5">
              {search && (
                <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs px-3 py-1 rounded-full">
                  "{search}"
                  <button onClick={() => setSearch("")} className="ml-1">✕</button>
                </span>
              )}
              {typeFilter !== "All" && (
                <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs px-3 py-1 rounded-full">
                  {typeFilter}
                  <button onClick={() => setType("All")} className="ml-1">✕</button>
                </span>
              )}
              {locationFilter !== "All" && (
                <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs px-3 py-1 rounded-full">
                  {locationFilter}
                  <button onClick={() => setLoc("All")} className="ml-1">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">No jobs found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                Try adjusting your search or clearing the filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}