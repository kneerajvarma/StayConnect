import axios from 'axios';
import { User } from '../types';

const API_URL = '/api/auth';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      console.warn('Backend offline, using fallback auth from local database', error);
      // Fallback handled by AppContext context state
      throw error;
    }
  },

  async register(data: any): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error) {
      console.warn('Backend offline, using fallback registration', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      console.warn('Backend offline logout');
    }
  }
};
