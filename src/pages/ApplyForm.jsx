import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";
import { useApplications } from "../context/ApplicationContext";

export default function ApplyForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { addApplication, hasApplied } = useApplications();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const job = jobs.find((j) => j.id === id);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition
     bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
     ${hasError ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"}`;

  if (!job) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Job not found</h2>
      <Link to="/jobs" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Back to listings</Link>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Login required</h2>
      <p className="text-gray-400 text-sm mb-6">You need to be logged in as a job seeker to apply.</p>
      <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Go to Login</Link>
    </div>
  );

  if (hasApplied(id, user.id)) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">✅</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Already applied</h2>
      <p className="text-gray-400 text-sm mb-6">You've already applied for <strong>{job.title}</strong>.</p>
      <div className="flex gap-3">
        <Link to="/dashboard/seeker" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">View My Applications</Link>
        <Link to="/jobs" className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Browse More Jobs</Link>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 max-w-md w-full shadow-sm">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Application Submitted!</h2>
        <p className="text-gray-400 text-sm mb-7">You applied for <span className="font-medium text-gray-700 dark:text-gray-200">{job.title}</span> at <span className="font-medium text-gray-700 dark:text-gray-200">{job.company}</span>.</p>
        <div className="flex flex-col gap-2">
          <Link to="/dashboard/seeker" className="bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">View My Applications</Link>
          <Link to="/jobs" className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Browse More Jobs</Link>
        </div>
      </div>
    </div>
  );

  const onSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 800));
    addApplication({ jobId: job.id, seekerId: user.id, jobTitle: job.title, company: job.company, ...data });
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to={`/jobs/${job.id}`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
          ← Back to job
        </Link>

        {/* Job Banner */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Applying for</p>
            <h2 className="font-semibold text-gray-800 dark:text-white">{job.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} · {job.location}</p>
          </div>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full
            ${job.type === "Remote" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : job.type === "Contract" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"}`}>
            {job.type}
          </span>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Your Application</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Fill in the details below. All fields are required.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {[
              { label: "Full Name", name: "fullName", type: "text", placeholder: "e.g. Ravi Kumar", rules: { required: "Full name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } } },
              { label: "Email Address", name: "email", type: "email", placeholder: "e.g. ravi@email.com", rules: { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } } },
              { label: "Phone Number", name: "phone", type: "tel", placeholder: "e.g. 9876543210", rules: { required: "Phone number is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian mobile number" } } },
            ].map(({ label, name, type, placeholder, rules }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">{label}</label>
                <input type={type} placeholder={placeholder} {...register(name, rules)} className={inputClass(errors[name])} />
                {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
              </div>
            ))}

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Years of Experience</label>
              <select {...register("experience", { required: "Please select your experience level" })}
                className={inputClass(errors.experience)}>
                <option value="">Select experience</option>
                {["Fresher (0 years)", "1-2 years", "3-5 years", "5-8 years", "8+ years"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Resume Link <span className="text-gray-400 font-normal ml-1">(Google Drive, Dropbox, etc.)</span>
              </label>
              <input type="url" placeholder="https://drive.google.com/your-resume"
                {...register("resumeUrl", { required: "Resume link is required", pattern: { value: /^https?:\/\/.+/, message: "Enter a valid URL" } })}
                className={inputClass(errors.resumeUrl)} />
              {errors.resumeUrl && <p className="text-xs text-red-500 mt-1">{errors.resumeUrl.message}</p>}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Cover Letter <span className="text-gray-400 font-normal ml-1">(min. 50 characters)</span>
              </label>
              <textarea rows={5} placeholder={`Tell ${job.company} why you're a great fit...`}
                {...register("coverLetter", { required: "Cover letter is required", minLength: { value: 50, message: "Cover letter must be at least 50 characters" } })}
                className={`${inputClass(errors.coverLetter)} resize-none`} />
              {errors.coverLetter && <p className="text-xs text-red-500 mt-1">{errors.coverLetter.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</>
              ) : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}