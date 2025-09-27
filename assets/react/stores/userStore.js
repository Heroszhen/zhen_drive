import { create } from 'zustand';
import { getRequestHeaders } from '../services/data.js';

const useUserStore = create(() => ({
  user: null,
}));
export default useUserStore;

export const getAuth = async (data) => {
  const headers = getRequestHeaders();
  delete headers.Authorization;
  try {
    let response = await fetch(`${process.env.DOMAIN}/api/auth`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    response = await response.json();
    if (response.token) {
      localStorage.setItem('token', response.token);
      getUser();
    }
  } catch {}
};

export const getUser = async () => {
  try {
    let response = await fetch(`${process.env.DOMAIN}/api/users/profile`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    if (response.ok) {
      response = await response.json();
      useUserStore.setState(() => ({ user: response }));
    }
  } catch {}
};
