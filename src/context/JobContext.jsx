import { createContext, useContext, useState, useEffect } from "react";
import { jobs as initialJobs } from "../data/jobs";

const JobContext = createContext();

const loadJobs = () => {
  try {
    const stored = localStorage.getItem("jp_jobs");
    return stored ? JSON.parse(stored) : initialJobs;
  } catch {
    return initialJobs;
  }
};

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(loadJobs);

  // Save to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem("jp_jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job) => {
    setJobs((prev) => [
      ...prev,
      {
        ...job,
        id: Date.now().toString(),
        postedAt: new Date().toISOString(),
        requirements: typeof job.requirements === "string"
          ? job.requirements.split(",").map((r) => r.trim()).filter(Boolean)
          : job.requirements,
      },
    ]);
  };

  const deleteJob = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}