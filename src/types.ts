export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  mobile?: string;
  address?: string;
  gender?: string;
  status?: 'active' | 'inactive';
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Homestay {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description: string;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  status: 'active' | 'inactive';
}

export interface Room {
  id: string;
  homestayId: string;
  roomNumber: string;
  roomType: 'Standard' | 'Deluxe' | 'Suite' | 'Family';
  capacity: number;
  price: number;
  availability: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  homestayId: string;
  homestayName: string;
  roomId: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Credit Card';
  status: 'Paid' | 'Pending' | 'Failed';
  paymentDate: string;
}

export interface Review {
  id: string;
  homestayId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Settings {
  systemName: string;
  contactEmail: string;
  currency: string;
  taxes: number; // percentage
  bookingRules: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalHomestays: number;
  activeRooms: number;
  activeBookings: number;
  completedBookings: number;
  revenue: number;
}
