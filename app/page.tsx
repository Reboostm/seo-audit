'use client';

export default function Dashboard() {
  return (
    <div className="flex">
      <div className="sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">ReBoost</h1>
          <p className="text-sm text-gray-500">SEO Audit</p>
        </div>
        <nav className="mt-8">
          <a href="/" className="block px-6 py-3 text-blue-600 font-medium border-l-4 border-blue-600 bg-blue-50">
            Dashboard
          </a>
          <a href="/leads" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Leads
          </a>
          <a href="/config" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Config
          </a>
        </nav>
      </div>
      <div className="main-content">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="card">
            <p className="text-gray-600">Leads Today</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>
          <div className="card">
            <p className="text-gray-600">This Week</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>
          <div className="card">
            <p className="text-gray-600">This Month</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>
        </div>
        <div className="card mt-8">
          <h2 className="text-lg font-bold">Status</h2>
          <p className="text-gray-600 mt-2">Dashboard loading... Configure your APIs in the Config section.</p>
        </div>
      </div>
    </div>
  );
}
