import axios from 'axios';
import { Homestay } from '../types';

const API_URL = '/api/homestays';

export const homestayService = {
  async getAll(): Promise<Homestay[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getById(id: string): Promise<Homestay> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async create(homestay: Omit<Homestay, 'id'>): Promise<Homestay> {
    const response = await axios.post(API_URL, homestay);
    return response.data;
  },

  async update(id: string, homestay: Partial<Homestay>): Promise<Homestay> {
    const response = await axios.put(`${API_URL}/${id}`, homestay);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
};
