import { createContext, useContext, useState, useEffect } from "react";

const ApplicationContext = createContext();

// Load from localStorage on startup
const loadApplications = () => {
  try {
    const stored = localStorage.getItem("jp_applications");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(loadApplications);

  // Save to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem("jp_applications", JSON.stringify(applications));
  }, [applications]);

  const addApplication = (application) => {
    setApplications((prev) => [
      ...prev,
      {
        ...application,
        id: Date.now().toString(),
        status: "Applied",
        appliedAt: new Date().toISOString(),
      },
    ]);
  };

  const hasApplied = (jobId, seekerId) =>
    applications.some((a) => a.jobId === jobId && a.seekerId === seekerId);

  const updateStatus = (applicationId, newStatus) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId ? { ...a, status: newStatus } : a
      )
    );
  };

  const removeApplication = (applicationId) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  return (
    <ApplicationContext.Provider
      value={{ applications, addApplication, hasApplied, updateStatus, removeApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  return useContext(ApplicationContext);
}