'use client';

import { useEffect, useState } from 'react';

interface ApiKeys {
  googlePlaces: string;
  serpapi: string;
  pageSpeed: string;
  ghl: string;
}

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
  apiKeys?: ApiKeys;
}

export default function Config() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    googlePlaces: '',
    serpapi: '',
    pageSpeed: '',
    ghl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [testingApi, setTestingApi] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
      if (data.apiKeys) {
        setApiKeys(data.apiKeys);
      }
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
        body: JSON.stringify({ ...config, apiKeys }),
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

  async function testConnection(apiName: string) {
    setTestingApi(apiName);
    try {
      // Simulate API test
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testApi: apiName, key: apiKeys[apiName as keyof ApiKeys] }),
      });

      if (response.ok) {
        setMessage(`✓ ${apiName} connection successful`);
      } else {
        setMessage(`✗ ${apiName} connection failed`);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Error testing ${apiName}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setTestingApi(null);
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
          <div className={`mb-6 p-4 rounded-md text-sm font-medium ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* API Keys Setup */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-6">🔑 API Keys Setup</h2>

          <div className="space-y-6">
            {/* Google Places API */}
            <div className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Google Places API</h3>
                  <p className="text-sm text-gray-600 mt-1">Search businesses and get GMB profile data</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${config.apiToggles.googlePlaces?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.apiToggles.googlePlaces?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <input
                type="password"
                placeholder="Paste your API key here..."
                value={apiKeys.googlePlaces}
                onChange={(e) => setApiKeys({ ...apiKeys, googlePlaces: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 text-gray-900"
              />
              <button
                onClick={() => testConnection('googlePlaces')}
                disabled={testingApi === 'googlePlaces' || !apiKeys.googlePlaces}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400"
              >
                {testingApi === 'googlePlaces' ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {/* SerpAPI */}
            <div className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">SerpAPI (Map Pack Ranking)</h3>
                  <p className="text-sm text-gray-600 mt-1">Get local Map Pack ranking and competitor data</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${config.apiToggles.serpapi?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.apiToggles.serpapi?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <input
                type="password"
                placeholder="Paste your SerpAPI key here..."
                value={apiKeys.serpapi}
                onChange={(e) => setApiKeys({ ...apiKeys, serpapi: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 text-gray-900"
              />
              <button
                onClick={() => testConnection('serpapi')}
                disabled={testingApi === 'serpapi' || !apiKeys.serpapi}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400"
              >
                {testingApi === 'serpapi' ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {/* PageSpeed Insights */}
            <div className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">PageSpeed Insights API</h3>
                  <p className="text-sm text-gray-600 mt-1">Get website speed and performance scores</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${config.apiToggles.pageSpeed?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.apiToggles.pageSpeed?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <input
                type="password"
                placeholder="Paste your PageSpeed key here..."
                value={apiKeys.pageSpeed}
                onChange={(e) => setApiKeys({ ...apiKeys, pageSpeed: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 text-gray-900"
              />
              <button
                onClick={() => testConnection('pageSpeed')}
                disabled={testingApi === 'pageSpeed' || !apiKeys.pageSpeed}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400"
              >
                {testingApi === 'pageSpeed' ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {/* GHL API - Prominent */}
            <div className="border-2 border-blue-300 bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">🚀 GoHighLevel (GHL) API</h3>
                  <p className="text-sm text-gray-700 mt-1 font-medium">Import leads and trigger automations</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${config.apiToggles.ghl?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.apiToggles.ghl?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <input
                type="password"
                placeholder="Paste your GHL API key here..."
                value={apiKeys.ghl}
                onChange={(e) => setApiKeys({ ...apiKeys, ghl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 text-gray-900 text-base"
              />
              <button
                onClick={() => testConnection('ghl')}
                disabled={testingApi === 'ghl' || !apiKeys.ghl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {testingApi === 'ghl' ? 'Testing...' : 'Test Connection'}
              </button>
              <p className="text-xs text-gray-600 mt-3">Reports will be emailed to leads via GHL automations</p>
            </div>
          </div>
        </div>

        {/* API Toggles */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold mb-6">API Toggles</h2>
          <div className="space-y-3">
            {Object.entries(config.apiToggles).map(([key, api]) => (
              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <label className="text-sm font-medium text-gray-700">
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
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    api.enabled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {api.enabled ? 'On' : 'Off'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Niche Defaults */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold mb-6">Niche Defaults (Optional)</h2>
          <p className="text-sm text-gray-600 mb-4">Fine-tune lost revenue estimates per niche</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Niche</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Avg Job Cost</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Calls Lost/Month</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(config.nicheDefaults).map(([niche, data]) => (
                  <tr key={niche} className="border-b border-gray-100">
                    <td className="py-2 px-3 font-medium text-gray-800 text-xs">
                      {niche.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-1">$</span>
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
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-3">
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
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg"
          >
            {saving ? 'Saving...' : '💾 Save Configuration'}
          </button>
          <p className="text-xs text-gray-500 self-center">All API keys are encrypted and stored securely</p>
        </div>
      </div>
    </div>
  );
}
