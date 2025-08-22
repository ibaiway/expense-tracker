import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import SignInPage from "./pages/auth/signin"
import SignUpPage from "./pages/auth/signup"
import DashboardPage from "./pages/dashboard/dashboard"
import DashboardLayout from "./layouts/dashboard-layout"
import { authClient } from "./auth/auth-client"
import ProjectsPage from "./pages/dashboard/projects"

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const session = authClient.useSession()
  console.log(session)
  if (session.isPending) return <div className="p-6">Loading!</div>
  return session.data?.user ? children : <Navigate to="/signin" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="settings" element={<h1>Settings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
