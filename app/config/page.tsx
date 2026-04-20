'use client';

export default function Config() {
  return (
    <div className="flex">
      <div className="sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">ReBoost</h1>
        </div>
        <nav className="mt-8">
          <a href="/" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Dashboard</a>
          <a href="/leads" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">Leads</a>
          <a href="/config" className="block px-6 py-3 text-blue-600 font-medium border-l-4 border-blue-600 bg-blue-50">Config</a>
        </nav>
      </div>
      <div className="main-content">
        <h1 className="text-3xl font-bold mb-8">Configuration</h1>
        <div className="card mb-8">
          <h2 className="text-lg font-bold mb-4">API Toggles</h2>
          <p className="text-gray-600">Configure your APIs here.</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Niche Defaults</h2>
          <p className="text-gray-600">Set revenue defaults for each niche.</p>
        </div>
      </div>
    </div>
  );
}
