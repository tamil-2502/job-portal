import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import ApplyForm from "./pages/ApplyForm";
import PostJob from "./pages/PostJob";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"        element={<Landing />} />
        <Route path="/jobs"    element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login"   element={<Login />} />

        {/* Seeker only */}
        <Route path="/apply/:id" element={
          <ProtectedRoute role="seeker">
            <ApplyForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/seeker" element={
          <ProtectedRoute role="seeker">
            <SeekerDashboard />
          </ProtectedRoute>
        } />

        {/* Employer only */}
        <Route path="/post-job" element={
          <ProtectedRoute role="employer">
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/employer" element={
          <ProtectedRoute role="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}