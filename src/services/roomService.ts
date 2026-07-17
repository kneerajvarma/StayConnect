import axios from 'axios';
import { Room } from '../types';

const API_URL = '/api/rooms';

export const roomService = {
  async getAll(): Promise<Room[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getByHomestay(homestayId: string): Promise<Room[]> {
    const response = await axios.get(`${API_URL}/homestay/${homestayId}`);
    return response.data;
  },

  async create(room: Omit<Room, 'id'>): Promise<Room> {
    const response = await axios.post(API_URL, room);
    return response.data;
  },

  async update(id: string, room: Partial<Room>): Promise<Room> {
    const response = await axios.put(`${API_URL}/${id}`, room);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
};
