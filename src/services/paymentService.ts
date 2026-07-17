import axios from 'axios';
import { Payment } from '../types';

const API_URL = '/api/payments';

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getByBooking(bookingId: string): Promise<Payment> {
    const response = await axios.get(`${API_URL}/booking/${bookingId}`);
    return response.data;
  },

  async processPayment(id: string, status: Payment['status']): Promise<Payment> {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  }
};
