import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useUserStore = create((set, get) => ({
    user: null,
}));

export const getAuth = async (data) => {
    const headers = getRequestHeaders();
    delete headers['Authorization'];
    try {
      let response = await fetch(`${process.env.DOMAIN}/api/auth`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
  
      response = await response.json()
      if (response.token) {
        localStorage.setItem('token', response.token);
        //getUser();
      }
    } catch {}
};