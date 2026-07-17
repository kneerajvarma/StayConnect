import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Customer, Homestay, Room, Booking, Payment, Review, Settings, DashboardStats 
} from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  customers: Customer[];
  homestays: Homestay[];
  rooms: Room[];
  bookings: Booking[];
  payments: Payment[];
  reviews: Review[];
  settings: Settings;
  currencySymbol: string;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, mobile: string, address: string, gender: 'Male' | 'Female' | 'Other') => Promise<User>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  addHomestay: (homestay: Omit<Homestay, 'id'>) => void;
  updateHomestay: (id: string, homestay: Partial<Homestay>) => void;
  deleteHomestay: (id: string) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>, paymentMethod?: 'UPI' | 'Credit Card' | 'Cash') => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  processPayment: (paymentId: string, status: Payment['status']) => void;
  addReview: (homestayId: string, rating: number, comment: string) => void;
  updateSettings: (settings: Settings) => void;
  getDashboardStats: () => DashboardStats;
  toast: {
    show: (message: string, type?: 'success' | 'error' | 'info') => void;
    message: string | null;
    type: 'success' | 'error' | 'info';
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: Settings = {
  systemName: 'StayConnect',
  contactEmail: 'support@stayconnect.com',
  currency: 'INR',
  taxes: 12.5,
  bookingRules: 'Standard 24-hour cancelation notice. Check-in 3:00 PM, Check-out 11:00 AM. No smoking inside the premises.'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State variables loaded from the backend
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const data = localStorage.getItem('sc_current_user');
    return data ? JSON.parse(data) : null;
  });

  // Simple Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Persist current user to localStorage for refresh reliability
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sc_current_user');
    }
  }, [currentUser]);

  // Load all data from backend REST APIs
  const fetchData = async () => {
    try {
      const [
        homestaysRes,
        roomsRes,
        customersRes,
        bookingsRes,
        paymentsRes,
        reviewsRes,
        usersRes,
        settingsRes
      ] = await Promise.all([
        axios.get('/api/homestays'),
        axios.get('/api/rooms'),
        axios.get('/api/customers'),
        axios.get('/api/bookings'),
        axios.get('/api/payments'),
        axios.get('/api/reviews'),
        axios.get('/api/users'),
        axios.get('/api/settings')
      ]);

      setHomestays(homestaysRes.data);
      setRooms(roomsRes.data);
      setCustomers(customersRes.data);
      setBookings(bookingsRes.data);
      setPayments(paymentsRes.data);
      setReviews(reviewsRes.data);
      setUsers(usersRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error('Error fetching data from Spring Boot REST API:', err);
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Authentication Actions
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const user = res.data;
      setCurrentUser(user);
      showToast(`Welcome back, ${user.name}!`, 'success');
      fetchData();
      return user;
    } catch (err) {
      showToast('Invalid email or password', 'error');
      throw err;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    mobile: string, 
    address: string, 
    gender: 'Male' | 'Female' | 'Other'
  ): Promise<User> => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, mobile, address, gender });
      const user = res.data;
      setCurrentUser(user);
      showToast('Registration successful!', 'success');
      fetchData();
      return user;
    } catch (err) {
      showToast('Registration failed', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Error logging out on backend', err);
    }
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (updated: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await axios.put(`/api/customers/${currentUser.id}`, updated);
      setCurrentUser({ ...currentUser, ...updated });
      showToast('Profile updated successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  // Homestay Actions
  const addHomestay = async (homestay: Omit<Homestay, 'id'>) => {
    try {
      await axios.post('/api/homestays', homestay);
      showToast('Homestay added successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to add homestay', 'error');
    }
  };

  const updateHomestay = async (id: string, homestay: Partial<Homestay>) => {
    try {
      await axios.put(`/api/homestays/${id}`, homestay);
      showToast('Homestay updated successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update homestay', 'error');
    }
  };

  const deleteHomestay = async (id: string) => {
    try {
      await axios.delete(`/api/homestays/${id}`);
      showToast('Homestay deleted successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to delete homestay', 'error');
    }
  };

  // Room Actions
  const addRoom = async (room: Omit<Room, 'id'>) => {
    try {
      await axios.post('/api/rooms', room);
      showToast('Room added successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to add room', 'error');
    }
  };

  const updateRoom = async (id: string, room: Partial<Room>) => {
    try {
      await axios.put(`/api/rooms/${id}`, room);
      showToast('Room updated successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update room', 'error');
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await axios.delete(`/api/rooms/${id}`);
      showToast('Room deleted successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to delete room', 'error');
    }
  };

  // Customer Actions
  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      await axios.post('/api/customers', customer);
      showToast('Customer added successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to add customer', 'error');
    }
  };

  const updateCustomer = async (id: string, customer: Partial<Customer>) => {
    try {
      await axios.put(`/api/customers/${id}`, customer);
      showToast('Customer updated successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update customer', 'error');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      showToast('Customer removed successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to delete customer', 'error');
    }
  };

  // Booking Actions
  const createBooking = async (
    booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>, 
    paymentMethod?: 'UPI' | 'Credit Card' | 'Cash'
  ): Promise<Booking> => {
    try {
      const res = await axios.post('/api/bookings', booking);
      showToast('Booking initiated successfully!', 'success');
      fetchData();
      return res.data;
    } catch (err) {
      showToast('Failed to create booking', 'error');
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status });
      showToast(`Booking ${status} successfully!`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update booking status', 'error');
    }
  };

  // Payment Actions
  const processPayment = async (paymentId: string, status: Payment['status']) => {
    try {
      await axios.patch(`/api/payments/${paymentId}/status`, { status });
      showToast(`Payment ${status}!`, status === 'Paid' ? 'success' : 'error');
      fetchData();
    } catch (err) {
      showToast('Payment processing failed', 'error');
    }
  };

  // Review Action
  const addReview = async (homestayId: string, rating: number, comment: string) => {
    try {
      await axios.post('/api/reviews', {
        homestayId,
        customerName: currentUser?.name || 'Anonymous Guest',
        rating,
        comment
      });
      showToast('Review submitted successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to submit review', 'error');
    }
  };

  // Settings Action
  const updateSettings = async (updatedSettings: Settings) => {
    try {
      const res = await axios.put('/api/settings', updatedSettings);
      setSettings(res.data);
      showToast('Settings updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    }
  };

  // Dashboard Stats Calculations
  const getDashboardStats = (): DashboardStats => {
    const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const revenue = payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalCustomers: customers.length,
      totalHomestays: homestays.length,
      activeRooms: rooms.filter(r => r.availability).length,
      activeBookings,
      completedBookings,
      revenue
    };
  };

  const currencySymbol = settings.currency === 'EUR' ? '€' : settings.currency === 'USD' ? '$' : '₹';

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      customers,
      homestays,
      rooms,
      bookings,
      payments,
      reviews,
      settings,
      currencySymbol,
      login,
      register,
      logout,
      updateProfile,
      addHomestay,
      updateHomestay,
      deleteHomestay,
      addRoom,
      updateRoom,
      deleteRoom,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      createBooking,
      updateBookingStatus,
      processPayment,
      addReview,
      updateSettings,
      getDashboardStats,
      toast: {
        show: showToast,
        message: toastMessage,
        type: toastType
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
