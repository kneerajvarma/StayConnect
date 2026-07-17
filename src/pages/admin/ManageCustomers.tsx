import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Plus, Edit, Trash2, Search, User, Mail, Phone, MapPin, Contact2 } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const ManageCustomers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, toast } = useApp();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<Customer['gender']>('Male');
  const [status, setStatus] = useState<Customer['status']>('active');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery)
  );

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setMobile('');
    setAddress('');
    setGender('Male');
    setStatus('active');
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (c: Customer) => {
    setEditingId(c.id);
    setName(c.name);
    setEmail(c.email);
    setMobile(c.mobile);
    setAddress(c.address);
    setGender(c.gender);
    setStatus(c.status);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !mobile || !address) {
      toast.show('Please complete all form fields', 'error');
      return;
    }

    const payload = {
      name,
      email,
      mobile,
      address,
      gender,
      status
    };

    if (editingId) {
      updateCustomer(editingId, payload);
    } else {
      addCustomer(payload);
    }

    setIsFormOpen(false);
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (deletingId) {
      deleteCustomer(deletingId);
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div id="manage-customers" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Customers</h1>
          <p className="text-gray-500 mt-1 font-medium">Verify registered traveler metrics, adjust account accessibility statuses, or manually provision guests.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search className="h-4 w-4" />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter customer accounts by name, email, tel..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm bg-white"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No customers found in active directories.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase bg-gray-50/50">
                  <th className="p-4 font-semibold">Traveler Details</th>
                  <th className="p-4 font-semibold">Contact Email</th>
                  <th className="p-4 font-semibold">Mobile Phone</th>
                  <th className="p-4 font-semibold">Registered Location</th>
                  <th className="p-4 font-semibold">Gender</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/30">
                    <td className="p-4 font-bold text-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <User className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 leading-none">{c.name}</div>
                          <span className="text-xxs text-gray-400 font-semibold font-mono">ID: {c.id.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-600">{c.email}</td>
                    <td className="p-4 font-mono text-xs font-semibold text-gray-600">{c.mobile}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-500 font-semibold text-xs line-clamp-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span>{c.address}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-500 text-xs">{c.gender}</td>
                    <td className="p-4">
                      <button
                        onClick={() => updateCustomer(c.id, { status: c.status === 'active' ? 'inactive' : 'active' })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize cursor-pointer
                          ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        <span>{c.status}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(c.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Traveler Information' : 'Manually Provision Customer'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-blue-600" />
                <span>Full Name *</span>
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Michael Scott"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Email Address *</span>
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="michael@dundermifflin.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                required
                disabled={editingId !== null}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                <span>Mobile Number *</span>
              </label>
              <input 
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 (555) 432-1090"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                <span>Residential Address *</span>
              </label>
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Scranton, Pennsylvania"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white font-medium"
              >
                <option value="active">Active (Access Allowed)</option>
                <option value="inactive">Inactive (Access Suspended)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              {editingId ? 'Update Customer' : 'Provision Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Overlays */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Remove Customer Account"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to remove this customer from the system directories? All bookings history and metadata associated with this user will still be kept for bookkeeping records.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSubmit}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer"
            >
              Permanently Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
