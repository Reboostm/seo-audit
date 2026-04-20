'use client';

import { useEffect, useState } from 'react';

interface ApiConfig {
  googlePlaces: { enabled: boolean };
  serpapi: { enabled: boolean };
  pageSpeed: { enabled: boolean };
  ghl: { enabled: boolean };
}

interface NicheDefaults {
  [key: string]: { jobCost: number; callsLostMonthly: number };
}

interface ConfigData {
  nicheDefaults: NicheDefaults;
  apiToggles: ApiConfig;
}

export default function Config() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!config) return;

    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage('✓ Configuration saved successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('✗ Error saving configuration');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
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
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
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
          <p>Error loading configuration</p>
        </div>
      </div>
    );
  }

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

        {message && (
          <div className={`mb-6 p-4 rounded-md text-sm ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* API Toggles */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold mb-6">API Toggles</h2>
          <div className="space-y-4">
            {Object.entries(config.apiToggles).map(([key, api]) => (
              <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <label className="font-medium text-gray-700">
                  {key === 'googlePlaces' && 'Google Places API'}
                  {key === 'serpapi' && 'SerpAPI (Map Pack Ranking)'}
                  {key === 'pageSpeed' && 'PageSpeed Insights API'}
                  {key === 'ghl' && 'GoHighLevel (GHL) API'}
                </label>
                <button
                  onClick={() =>
                    setConfig({
                      ...config,
                      apiToggles: {
                        ...config.apiToggles,
                        [key]: { enabled: !api.enabled },
                      },
                    })
                  }
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    api.enabled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {api.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Niche Defaults */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold mb-6">Niche Defaults</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Niche</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Job Cost</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Calls Lost/Month</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(config.nicheDefaults).map(([niche, data]) => (
                  <tr key={niche} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {niche.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">$</span>
                        <input
                          type="number"
                          value={data.jobCost}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              nicheDefaults: {
                                ...config.nicheDefaults,
                                [niche]: {
                                  ...data,
                                  jobCost: parseInt(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={data.callsLostMonthly}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            nicheDefaults: {
                              ...config.nicheDefaults,
                              [niche]: {
                                ...data,
                                callsLostMonthly: parseInt(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-900"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
