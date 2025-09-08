import React, { useMemo, useEffect } from "react";
import axios from "axios";
import useAuth from './useAuth';

const useAxiosSecure = () => {
  const { user } = useAuth(); 
  
  const instance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }, []);

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              config.headers.Authorization = `Bearer ${token}`;
            } else {
              console.warn("Invalid token format");
              localStorage.removeItem("access-token");
              config.headers['x-user-id'] = 'dev-fallback-user';
            }
          } catch (error) {
            console.warn("Token validation error:", error);
            localStorage.removeItem("access-token");
            config.headers['x-user-id'] = 'dev-fallback-user';
          }
        } else {
          config.headers['x-user-id'] = 'dev-fallback-user';
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("access-token");
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [instance, user]);

  return instance;
};

export default useAxiosSecure;