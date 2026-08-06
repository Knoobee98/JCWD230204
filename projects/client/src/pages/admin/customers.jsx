import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import api from '../../utils/api';

const emptyForm = {
  username: '',
  email: '',
  password: '',
  name: '',
  phone_number: '',
};

const emptyEdit = {
  id: '',
  username: '',
  email: '',
  phone_number: '',
  status: 'Confirmed',
  name: '',
};

function Customers() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEdit);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/getUsers');
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/createUser', {
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name,
        phone_number: form.phone_number,
      });
      toast.success('User created');
      setForm(emptyForm);
      setShowAdd(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditOpen = (user) => {
    setEditForm({
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      status: user.status || 'Confirmed',
      name: user.profile?.name || '',
    });
    setEditingUser(user);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/admin/updateUser/${editForm.id}`, {
        username: editForm.username,
        email: editForm.email,
        phone_number: editForm.phone_number,
        status: editForm.status,
        name: editForm.name,
      });
      toast.success('User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This also removes their carts, addresses and transactions.')) return;
    try {
      await api.delete(`/api/admin/deleteUser/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB');
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
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Customers ✨</h1>
              </div>
              <button onClick={() => setShowAdd(true)} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="ml-2">Add Customer</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Name</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Username</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Email</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Phone</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Status</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-right">Orders</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-left">Joined</div></th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div className="font-semibold text-right">Actions</div></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 border-b border-slate-200">
                    {loading ? (
                      <tr><td colSpan="8" className="px-2 py-8 text-center text-slate-400">Loading customers...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan="8" className="px-2 py-8 text-center text-slate-400">No customers found</td></tr>
                    ) : users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{user.profile?.name || '-'}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-slate-600">{user.username}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-slate-600">{user.email}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-slate-600">{user.phone_number || '-'}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <span className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${user.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {user.status || 'unconfirmed'}
                          </span>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-right text-slate-700">{user.transaction_count || 0}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-slate-600">{formatDate(user.createdAt)}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-right space-x-3">
                            <button onClick={() => handleEditOpen(user)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                            <button onClick={() => handleDelete(user.id)} className="text-xs font-medium text-rose-600 hover:text-rose-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>

        {/* Add user modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900 bg-opacity-50" onClick={() => setShowAdd(false)} />
            <div className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg text-slate-800 font-bold">Add Customer</h2>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                </button>
              </div>
              <form onSubmit={handleCreate} className="px-6 py-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-input w-full" />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                  <input name="username" value={form.username} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                  <input name="phone_number" value={form.phone_number} onChange={handleChange} className="form-input w-full" />
                </div>
                <div className="col-span-12 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200">Cancel</button>
                  <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Create Customer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit user modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900 bg-opacity-50" onClick={() => setEditingUser(null)} />
            <div className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg text-slate-800 font-bold">Edit Customer</h2>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                </button>
              </div>
              <form onSubmit={handleUpdate} className="px-6 py-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                  <input name="name" value={editForm.name} onChange={handleEditChange} className="form-input w-full" />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                  <input name="username" value={editForm.username} onChange={handleEditChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <input name="email" type="email" value={editForm.email} onChange={handleEditChange} className="form-input w-full" required />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                  <input name="phone_number" value={editForm.phone_number} onChange={handleEditChange} className="form-input w-full" />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                  <select name="status" value={editForm.status} onChange={handleEditChange} className="form-select w-full">
                    <option value="Confirmed">Confirmed</option>
                    <option value="unconfirmed">Unconfirmed</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div className="col-span-12 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingUser(null)} className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200">Cancel</button>
                  <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default Customers;
