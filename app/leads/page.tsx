'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  niche: string;
  city: string;
  state: string;
  status: string;
  submittedAt: any;
  gmbScore?: number;
  mapPackRank?: number;
  lostRevenueMonthly?: number;
}

const NICHES = [
  // Home Services
  'plumber',
  'electrician',
  'hvac',
  'roofer',
  'painter',
  'handyman',
  'contractor',
  'landscaper',
  'tree_service',
  'pool_service',
  'chimney_sweep',
  // Cleaning Services
  'pest_control',
  'house_cleaning',
  'carpet_cleaner',
  'window_cleaning',
  'pressure_washing',
  // Auto Services
  'auto_mechanic',
  'auto_detailing',
  'car_wash',
  'tire_shop',
  // Security & Other
  'locksmith',
  'security_system',
  // Professional Services
  'lawyer',
  'accountant',
  'dentist',
  'chiropractor',
  'physical_therapist',
  'veterinarian',
  // Beauty & Wellness
  'hair_salon',
  'nail_salon',
  'spa',
  'massage_therapy',
  'personal_trainer',
  'yoga_studio',
  // Real Estate & Property
  'realtor',
  'property_manager',
  'home_inspector',
  // Pet Services
  'pet_grooming',
  'pet_training',
  'dog_daycare',
  // Business Services
  'web_design',
  'digital_marketing',
  'tax_preparation',
];

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    niche: '',
    state: '',
    city: '',
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.niche) params.append('niche', filters.niche);
      if (filters.state) params.append('state', filters.state);
      if (filters.city) params.append('city', filters.city);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      setLeads(leads.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      processing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

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

        {/* Filters */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niche</label>
              <select
                value={filters.niche}
                onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="">All Niches</option>
                {NICHES.map(niche => (
                  <option key={niche} value={niche}>
                    {niche.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="">All States</option>
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                placeholder="Search city..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="card">
          {loading ? (
            <p className="text-gray-600">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="text-gray-600">No leads found. Forms will appear here once submitted.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Business Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Niche</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">City, State</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedLead(lead)}>
                        {lead.businessName}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{lead.email}</td>
                      <td className="py-3 px-4 text-gray-600">{lead.niche.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-gray-600">{lead.city}, {lead.state}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedLead.businessName}</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3 text-gray-600">
                <p><span className="font-semibold text-gray-900">Email:</span> {selectedLead.email}</p>
                <p><span className="font-semibold text-gray-900">Phone:</span> {selectedLead.phone}</p>
                <p><span className="font-semibold text-gray-900">Niche:</span> {selectedLead.niche.replace('_', ' ')}</p>
                <p><span className="font-semibold text-gray-900">Location:</span> {selectedLead.city}, {selectedLead.state}</p>
                <p><span className="font-semibold text-gray-900">Status:</span> {selectedLead.status}</p>
                {selectedLead.mapPackRank && (
                  <p><span className="font-semibold text-gray-900">Map Pack Rank:</span> #{selectedLead.mapPackRank}</p>
                )}
                {selectedLead.gmbScore !== undefined && (
                  <p><span className="font-semibold text-gray-900">GMB Score:</span> {selectedLead.gmbScore}%</p>
                )}
                {selectedLead.lostRevenueMonthly && (
                  <p><span className="font-semibold text-gray-900">Lost Revenue/Month:</span> ${selectedLead.lostRevenueMonthly}</p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedLead.id);
                    setSelectedLead(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
