import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import SignInPage from "./pages/auth/signin"
import SignUpPage from "./pages/auth/signup"
import DashboardPage from "./pages/dashboard/dashboard"
import DashboardLayout from "./layouts/dashboard-layout"
import { authClient } from "./auth/auth-client"
import ProjectsPage from "./pages/dashboard/projects"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProjectPage from "./pages/dashboard/project"

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const session = authClient.useSession()
  console.log(session)
  if (session.isPending) return <div className="p-6">Loading!</div>
  return session.data?.user ? children : <Navigate to="/signin" />
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="projects/:projectId" element={<ProjectPage />} />
            <Route path="settings" element={<h1>Settings</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
