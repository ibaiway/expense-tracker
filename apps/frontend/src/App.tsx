import { BrowserRouter, Routes, Route, Outlet } from "react-router"
import SignInPage from "./pages/auth/signin"
import SignUpPage from "./pages/auth/signup"
import DashboardPage from "./pages/dashboard/dashboard"
import DashboardLayout from "./layouts/dashboard-layout"
import SimpleLayout from "./layouts/simple-layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<h1>Projects</h1>} />
          <Route path="settings" element={<h1>Settings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
