import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = 'http://localhost:8000/api';
const SUPABASE_URL = 'https://foliylmmwevcanfnssna.supabase.co';
const SUPABASE_ANON_KEY = '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return await response.json();
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// PDF API
export const pdfAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/pdfs/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return await response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/pdfs`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return await response.json();
  },
};

// Research API
export const researchAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/research`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch research data:', error);
      return [];
    }
  },

  getByYear: async (year) => {
    try {
      const response = await fetch(`${API_BASE_URL}/research/year/${year}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch research data by year:', error);
      return [];
    }
  },
};

// Email API
export const emailAPI = {
  generate: async (researchId) => {
    const response = await fetch(`${API_BASE_URL}/email/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ researchId }),
    });
    return await response.json();
  },
};
