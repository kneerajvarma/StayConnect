import axios from 'axios';
import { Booking } from '../types';

const API_URL = '/api/bookings';

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getById(id: string): Promise<Booking> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async getByCustomer(customerId: string): Promise<Booking[]> {
    const response = await axios.get(`${API_URL}/customer/${customerId}`);
    return response.data;
  },

  async create(booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>): Promise<Booking> {
    const response = await axios.post(API_URL, booking);
    return response.data;
  },

  async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  }
};
