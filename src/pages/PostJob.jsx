import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";

const JOB_TYPES    = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];
const LOCATIONS    = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune", "Remote"];
const SALARY_RANGE = ["₹2-4 LPA","₹4-6 LPA","₹6-10 LPA","₹8-12 LPA","₹10-15 LPA","₹12-18 LPA","₹18-25 LPA","₹25+ LPA"];

export default function PostJob() {
  const { user } = useAuth();
  const { addJob } = useJobs();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [postedJob, setPostedJob] = useState(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const descValue = watch("description", "");

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition
     bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
     ${hasError ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`;

  if (!user) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Login required</h2>
      <p className="text-gray-400 text-sm mb-6">You need to be logged in as an employer to post a job.</p>
      <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Go to Login</Link>
    </div>
  );

  if (user.role !== "employer") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🚫</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Employers only</h2>
      <p className="text-gray-400 text-sm mb-6">Only employer accounts can post jobs.</p>
      <Link to="/jobs" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Browse Jobs Instead</Link>
    </div>
  );

  if (submitted && postedJob) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 max-w-md w-full shadow-sm">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚀</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Job Posted!</h2>
        <p className="text-gray-400 text-sm mb-7"><span className="font-medium text-gray-700 dark:text-gray-200">{postedJob.title}</span> at <span className="font-medium text-gray-700 dark:text-gray-200">{postedJob.company}</span> is now live.</p>
        <div className="flex flex-col gap-2">
          <Link to="/dashboard/employer" className="bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Manage My Listings</Link>
          <button onClick={() => { setSubmitted(false); setPostedJob(null); }} className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Post Another Job</button>
        </div>
      </div>
    </div>
  );

  const onSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 800));
    const newJob = { ...data, employerId: user.id, employerName: user.name };
    addJob(newJob);
    setPostedJob(newJob);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Post a Job</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Your listing goes live immediately.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Job Title</label>
              <input type="text" placeholder="e.g. Senior React Developer"
                {...register("title", { required: "Job title is required", minLength: { value: 3, message: "Title must be at least 3 characters" } })}
                className={inputClass(errors.title)} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Company Name</label>
              <input type="text" placeholder="e.g. TechCorp India"
                {...register("company", { required: "Company name is required" })}
                className={inputClass(errors.company)} />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
            </div>

            {/* Type + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Job Type</label>
                <select {...register("type", { required: "Job type is required" })} className={inputClass(errors.type)}>
                  <option value="">Select type</option>
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Location</label>
                <select {...register("location", { required: "Location is required" })} className={inputClass(errors.location)}>
                  <option value="">Select location</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Salary Range</label>
              <select {...register("salary", { required: "Salary range is required" })} className={inputClass(errors.salary)}>
                <option value="">Select salary range</option>
                {SALARY_RANGE.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary.message}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Skills Required <span className="text-gray-400 font-normal ml-1">(comma separated)</span>
              </label>
              <input type="text" placeholder="e.g. React, TypeScript, Node.js"
                {...register("requirements", { required: "At least one skill is required" })}
                className={inputClass(errors.requirements)} />
              {errors.requirements && <p className="text-xs text-red-500 mt-1">{errors.requirements.message}</p>}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Description</label>
                <span className={`text-xs ${descValue.length < 50 ? "text-gray-400" : "text-green-500"}`}>
                  {descValue.length} / 50 min
                </span>
              </div>
              <textarea rows={5} placeholder="Describe the role and responsibilities..."
                {...register("description", { required: "Job description is required", minLength: { value: 50, message: "Description must be at least 50 characters" } })}
                className={`${inputClass(errors.description)} resize-none`} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-2" />

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Publishing...</>
              ) : "Publish Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}