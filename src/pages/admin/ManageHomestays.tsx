import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Homestay } from '../../types';
import { 
  Plus, Edit, Trash2, Search, MapPin, Eye, ToggleLeft, ToggleRight, CheckSquare, XSquare, HelpCircle 
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const ManageHomestays: React.FC = () => {
  const { homestays, addHomestay, updateHomestay, deleteHomestay, toast, currencySymbol } = useApp();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState(150);
  const [amenitiesInput, setAmenitiesInput] = useState('Wifi, Air Conditioning, Kitchen');
  const [imageInput, setImageInput] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const filteredHomestays = homestays.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName('');
    setAddress('');
    setCity('');
    setState('');
    setDescription('');
    setPricePerNight(150);
    setAmenitiesInput('Wifi, Air Conditioning, Kitchen');
    setImageInput('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');
    setStatus('active');
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (hs: Homestay) => {
    setEditingId(hs.id);
    setName(hs.name);
    setAddress(hs.address);
    setCity(hs.city);
    setState(hs.state);
    setDescription(hs.description);
    setPricePerNight(hs.pricePerNight);
    setAmenitiesInput(hs.amenities.join(', '));
    setImageInput(hs.images.join(', '));
    setStatus(hs.status);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !city || !state || !description) {
      toast.show('Please fill in all details', 'error');
      return;
    }

    const amenities = amenitiesInput.split(',').map(a => a.trim()).filter(a => a);
    const images = imageInput.split(',').map(url => url.trim()).filter(url => url);

    const payload = {
      name,
      address,
      city,
      state,
      description,
      pricePerNight,
      amenities,
      images,
      status
    };

    if (editingId) {
      updateHomestay(editingId, payload);
    } else {
      addHomestay(payload);
    }

    setIsFormOpen(false);
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (deletingId) {
      deleteHomestay(deletingId);
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div id="manage-homestays" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Homestays</h1>
          <p className="text-gray-500 mt-1 font-medium">Create, read, update, or remove partner homestay portfolios.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Homestay</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search className="h-4 w-4" />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter homestays by name, city, state..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm bg-white"
        />
      </div>

      {/* Homestay Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredHomestays.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No homestays found cataloged in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase bg-gray-50/50">
                  <th className="p-4 font-semibold">Homestay Details</th>
                  <th className="p-4 font-semibold">City / State</th>
                  <th className="p-4 font-semibold">Base Price</th>
                  <th className="p-4 font-semibold">Amenities Count</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHomestays.map((hs) => (
                  <tr key={hs.id} className="hover:bg-gray-50/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={hs.images[0]} 
                          alt={hs.name}
                          className="w-12 h-10 rounded-lg object-cover bg-gray-100 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-gray-800 line-clamp-1">{hs.name}</div>
                          <div className="text-xxs text-gray-400 font-mono">ID: {hs.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-xs">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                        <span>{hs.city}, {hs.state}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{currencySymbol}{hs.pricePerNight} <span className="text-xxs text-gray-400">/ night</span></td>
                    <td className="p-4 font-medium text-gray-500">{hs.amenities.length} items</td>
                    <td className="p-4">
                      <button
                        onClick={() => updateHomestay(hs.id, { status: hs.status === 'active' ? 'inactive' : 'active' })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize cursor-pointer
                          ${hs.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${hs.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        <span>{hs.status}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(hs)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(hs.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Homestay"
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

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Homestay Details' : 'Add New Homestay'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Homestay Name *</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mountain Cabin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price Per Night ({currencySymbol}) *</label>
              <input 
                type="number"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                min={50}
                max={10000}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address *</label>
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Aspen Road"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City *</label>
              <input 
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Aspen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State *</label>
              <input 
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Colorado"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Visibility Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide historical backdrops, tourist points, and details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amenities (Comma separated) *</label>
            <input 
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              placeholder="Wifi, Pool, Ocean View, Fireplace"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Images (Comma separated URLs) *</label>
            <input 
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1..., https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden font-mono"
              required
            />
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
              {editingId ? 'Update Homestay' : 'Register Homestay'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Overlays */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Delete Homestay"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this homestay? <strong>This operation is irreversible!</strong> All rooms associated with this homestay will be permanently deleted as well.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={handleDeleteSubmit}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer"
            >
              Permanently Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
