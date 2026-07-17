import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';
import { Plus, Edit, Trash2, Search, Home, Bed, Users, Percent, HelpCircle } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const ManageRooms: React.FC = () => {
  const { rooms, homestays, addRoom, updateRoom, deleteRoom, toast, currencySymbol } = useApp();

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHomestayId, setFilterHomestayId] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [homestayId, setHomestayId] = useState(homestays[0]?.id || '');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState<Room['roomType']>('Standard');
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState(150);
  const [availability, setAvailability] = useState(true);

  // Filter logic
  const filteredRooms = rooms.filter(r => {
    const matchesQuery = r.roomNumber.includes(searchQuery) || r.roomType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHomestay = filterHomestayId === '' || r.homestayId === filterHomestayId;
    return matchesQuery && matchesHomestay;
  });

  const getHomestayName = (id: string) => {
    return homestays.find(h => h.id === id)?.name || 'Unknown Homestay';
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setHomestayId(homestays[0]?.id || '');
    setRoomNumber('');
    setRoomType('Standard');
    setCapacity(2);
    setPrice(150);
    setAvailability(true);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (r: Room) => {
    setEditingId(r.id);
    setHomestayId(r.homestayId);
    setRoomNumber(r.roomNumber);
    setRoomType(r.roomType);
    setCapacity(r.capacity);
    setPrice(r.price);
    setAvailability(r.availability);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !homestayId) {
      toast.show('Please enter room number and select homestay', 'error');
      return;
    }

    const payload = {
      homestayId,
      roomNumber,
      roomType,
      capacity,
      price,
      availability
    };

    if (editingId) {
      updateRoom(editingId, payload);
    } else {
      addRoom(payload);
    }

    setIsFormOpen(false);
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (deletingId) {
      deleteRoom(deletingId);
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div id="manage-rooms" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Rooms</h1>
          <p className="text-gray-500 mt-1 font-medium">Add, update, or edit individual room numbers, capacity limits, and pricing structures.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center max-w-2xl">
        <div className="relative w-full sm:w-1/2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by room # or type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm bg-white"
          />
        </div>

        <div className="w-full sm:w-1/2">
          <select
            value={filterHomestayId}
            onChange={(e) => setFilterHomestayId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm font-medium text-gray-700 bg-white"
          >
            <option value="">Filter by Homestay</option>
            {homestays.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredRooms.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No rooms found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase bg-gray-50/50">
                  <th className="p-4 font-semibold">Room Number</th>
                  <th className="p-4 font-semibold">Homestay Complex</th>
                  <th className="p-4 font-semibold">Room Type</th>
                  <th className="p-4 font-semibold">Capacity</th>
                  <th className="p-4 font-semibold">Price per night</th>
                  <th className="p-4 font-semibold">Availability</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRooms.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5 font-bold text-gray-800">
                        <Bed className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                        <span>Room #{r.roomNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-xs">
                        <Home className="h-3.5 w-3.5 text-gray-400" />
                        <span>{getHomestayName(r.homestayId)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-500 text-xs">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700">{r.roomType}</span>
                    </td>
                    <td className="p-4 font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span>{r.capacity} Guests</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{currencySymbol}{r.price}</td>
                    <td className="p-4">
                      <button
                        onClick={() => updateRoom(r.id, { availability: !r.availability })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize cursor-pointer
                          ${r.availability ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${r.availability ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{r.availability ? 'Available' : 'Occupied'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(r)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(r.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Room"
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
        title={editingId ? 'Edit Room Inventory' : 'Register New Room'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Homestay Complex *</label>
            <select
              value={homestayId}
              onChange={(e) => setHomestayId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white font-semibold"
              required
            >
              {homestays.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Number *</label>
              <input 
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="101A, 204"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Class / Type *</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white font-medium"
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Family">Family</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity (Max Guests) *</label>
              <input 
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price Per Night ({currencySymbol}) *</label>
              <input 
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={20}
                max={10000}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Availability</label>
            <select
              value={availability ? 'true' : 'false'}
              onChange={(e) => setAvailability(e.target.value === 'true')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white"
            >
              <option value="true">Available (Vacant)</option>
              <option value="false">Occupied (Pre-Booked)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Dismiss
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              {editingId ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Room Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Delete Room Entry"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this room from the database? This action cannot be undone, and will immediately cancel any associated pending bookings.
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
              Delete Room
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
