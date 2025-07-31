import { Outlet } from "react-router"

export default function SimpleLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
