import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import LandingPage from "./pages/LandingPage"
import PricingPage from "./pages/PricingPage"
import FeaturesPage from "./pages/FeaturesPage"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCourseGenerator from "./pages/AdminCourseGenerator"
import LearnerDashboard from "./pages/LearnerDashboard"
import CourseCatalog from "./pages/CourseCatalog"
import LessonPlayer from "./pages/LessonPlayer"
import LoginPage from "./pages/LoginPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/team" element={<div className="p-6">Team Progress (WIP)</div>} />
          <Route path="/admin/content" element={<div className="p-6">Content Library (WIP)</div>} />
          <Route path="/admin/generate-course" element={<AdminCourseGenerator />} />
          <Route path="/admin/settings" element={<div className="p-6">Settings (WIP)</div>} />
        </Route>

        {/* Learner Routes */}
        <Route element={<DashboardLayout role="learner" />}>
          <Route path="/learner" element={<LearnerDashboard />} />
          <Route path="/learner/catalog" element={<CourseCatalog />} />
          <Route path="/learner/settings" element={<div className="p-6">Settings (WIP)</div>} />
        </Route>

        {/* Full Screen Player */}
        <Route path="/lesson/:id" element={<LessonPlayer />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
