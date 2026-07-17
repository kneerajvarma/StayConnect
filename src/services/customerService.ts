import axios from 'axios';
import { Customer } from '../types';

const API_URL = '/api/customers';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async create(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const response = await axios.post(API_URL, customer);
    return response.data;
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await axios.put(`${API_URL}/${id}`, customer);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
};
