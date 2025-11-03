import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } catch {}
      if (typeof window !== 'undefined') {
        window.location.assign('/auth/signin');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
