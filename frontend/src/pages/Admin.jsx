import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Admin() {
  const [settings, setSettings] = useState({ enabled: false, client_id: '', client_secret: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/paypal-settings').then(res => setSettings(res.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/paypal-settings', settings);
      setMsg('Settings saved successfully.');
    } catch (e) {
      setMsg('Error saving settings.');
    }
  };

  return (
    <div className="py-12 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="card">
        <h2 className="text-xl font-bold mb-6">Payment Configuration</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary"
              checked={settings.enabled}
              onChange={e => setSettings({ ...settings, enabled: e.target.checked })}
            />
            <label htmlFor="enabled" className="text-slate-300 font-medium">Enable PayPal Integration</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Client ID</label>
            <input
              type="text"
              className="input w-full"
              value={settings.client_id || ''}
              onChange={e => setSettings({ ...settings, client_id: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Client Secret</label>
            <input
              type="password"
              className="input w-full"
              value={settings.client_secret || ''}
              onChange={e => setSettings({ ...settings, client_secret: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-primary px-6">
              Save Configuration
            </button>
          </div>

          {msg && (
            <div className="text-emerald-400 text-sm font-medium">
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Admin;