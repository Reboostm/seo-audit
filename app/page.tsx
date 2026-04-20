'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  avgGenerationTime: number;
  apiSuccessRate: number;
  failedReports: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    leadsToday: 0,
    leadsThisWeek: 0,
    leadsThisMonth: 0,
    avgGenerationTime: 0,
    apiSuccessRate: 0,
    failedReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }

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

        {/* Lead Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Leads Today</p>
            <h2 className="text-4xl font-bold mt-2 text-blue-600">{metrics.leadsToday}</h2>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">This Week</p>
            <h2 className="text-4xl font-bold mt-2 text-green-600">{metrics.leadsThisWeek}</h2>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">This Month</p>
            <h2 className="text-4xl font-bold mt-2 text-purple-600">{metrics.leadsThisMonth}</h2>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Avg Generation Time</p>
            <h2 className="text-3xl font-bold mt-2">{metrics.avgGenerationTime}s</h2>
            <p className="text-xs text-gray-500 mt-2">per report</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">API Success Rate</p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">{metrics.apiSuccessRate}%</h2>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm font-medium">Failed Reports</p>
            <h2 className="text-3xl font-bold mt-2 text-red-600">{metrics.failedReports}</h2>
          </div>
        </div>

        {/* Status Card */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Google Places API</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">PageSpeed Insights</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">GoHighLevel API</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Report Generation</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card mt-8">
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/leads" className="p-4 border border-blue-200 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium">
              → View All Leads
            </a>
            <a href="/config" className="p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium">
              → Configure APIs
            </a>
          </div>
        </div>

        {/* Embeddable Form Info */}
        <div className="card mt-8">
          <h2 className="text-lg font-bold mb-4">Embed Your Form</h2>
          <p className="text-gray-600 text-sm mb-4">
            Place this form on your GHL landing pages to capture business information and generate audit reports:
          </p>
          <div className="bg-gray-100 p-4 rounded-md font-mono text-xs text-gray-700 overflow-x-auto">
            &lt;iframe src="{typeof window !== 'undefined' ? window.location.origin : ''}/form.html" width="100%" height="600"&gt;&lt;/iframe&gt;
          </div>
          <p className="text-gray-600 text-xs mt-3">
            Or download the form.html file and embed it directly on your pages.
          </p>
        </div>
      </div>
    </div>
  );
}
