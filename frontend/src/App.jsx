import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import DashboardConfigPage from "./pages/DashboardConfigPage";
import OrdersPage from "./pages/OrdersPage";
import EmployeesPage from "./pages/EmployeesPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import SettingsPage from "./pages/SettingsPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import { useAuthStore } from "./store/useAuthStore";

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function DashboardRoute() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === "admin") return <AdminDashboardPage />;
  return <EmployeeDashboardPage />;
}

function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Profile setup — protected but outside main layout */}
      <Route path="/profile-setup" element={
        <ProtectedRoute><ProfileSetupPage /></ProtectedRoute>
      } />

      <Route element={
        <ProtectedRoute><Layout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/dashboard/configure" element={<DashboardConfigPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/employees" element={<AdminRoute><EmployeesPage /></AdminRoute>} />
        <Route path="/employees/:id" element={<AdminRoute><EmployeeDetailPage /></AdminRoute>} />
        {/* Settings accessible by all roles */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
