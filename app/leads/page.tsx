'use client';

export default function Leads() {
  return (
    <div className="flex">
      <div className="sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">ReBoost</h1>
        </div>
        <nav className="mt-8">
          <a href="/" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Dashboard</a>
          <a href="/leads" className="block px-6 py-3 text-blue-600 font-medium border-l-4 border-blue-600 bg-blue-50">Leads</a>
          <a href="/config" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Config</a>
        </nav>
      </div>
      <div className="main-content">
        <h1 className="text-3xl font-bold mb-8">Leads</h1>
        <div className="card">
          <p className="text-gray-600">No leads yet. Forms will appear here once submitted.</p>
        </div>
      </div>
    </div>
  );
}
