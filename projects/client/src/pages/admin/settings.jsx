import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import api from '../../utils/api';

const knownKeys = ['store_name', 'shipping_fee'];

function Settings() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/admin/getSettings');
      const data = response.data.data || {};
      const next = {};
      knownKeys.forEach((key) => {
        next[key] = data[key] !== undefined ? data[key] : '';
      });
      setForm(next);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/admin/saveSettings', {
        settings: {
          store_name: form.store_name,
          shipping_fee: form.shipping_fee,
        },
      });
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">E-Commerce Settings</h1>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg text-slate-800 font-semibold">Store Settings</h2>
              </div>
              {loading ? (
                <div className="px-6 py-8 text-center text-slate-400">Loading settings...</div>
              ) : (
                <form onSubmit={handleSave} className="px-6 py-4 grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-6">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Store Name</label>
                    <input name="store_name" value={form.store_name || ''} onChange={handleChange} className="form-input w-full" placeholder="e.g. Gamepedia" />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Shipping Fee (IDR)</label>
                    <input name="shipping_fee" type="number" value={form.shipping_fee || ''} onChange={handleChange} className="form-input w-full" placeholder="e.g. 15000" />
                  </div>
                  <div className="col-span-12 flex justify-end gap-2">
                    <button type="button" onClick={fetchSettings} className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200">Reset</button>
                    <button type="submit" disabled={saving} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default Settings;
