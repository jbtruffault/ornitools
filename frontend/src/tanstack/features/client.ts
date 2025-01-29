import axios, { AxiosError } from 'axios';
import { Mutex } from 'async-mutex';
import { User } from '@/types/user';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError;
  }
}

const mutex = new Mutex();

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
//  headers: {
//    'Content-Type': 'application/json',
//  },
  withCredentials: true,
});

// Custom function to wait for unlock with a timeout
async function waitForUnlockWithTimeout(mutex: Mutex, timeout: number): Promise<void> {
  return Promise.race<void>([
    mutex.waitForUnlock() as Promise<void>,
    new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error('Mutex wait timed out')), timeout)
    ),
  ]);
}

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 error - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          // Send refresh request, refresh token automatically included via cookies
          await apiClient.post('/jwt/refresh/');

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          release();
        }
      } else {
        try {
          // Wait for the mutex to be released, with a timeout of 5000ms (5 seconds)
          await waitForUnlockWithTimeout(mutex, 5000);
        } catch (timeoutError) {
          console.error('Timeout while waiting for mutex:', timeoutError);
          return Promise.reject(timeoutError);
        }
        return apiClient(originalRequest); // Retry once mutex is released
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const fetchUser = async () => {
  //const token = localStorage.getItem("access_token");
  //console.log("DEBUG token", token)
  //if (!token) {
  //  return null;
  //}
  try {
    const response = await apiClient.get<User>("/users/me/");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/jwt/create/", { email, password });
      //const { access, refresh } = response.data;
      //localStorage.setItem("access_token", access);
      //localStorage.setItem("refresh_token", refresh);
      //apiClient.defaults.headers["Authorization"] = `Bearer ${access}`;
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false };
    }
  };


export const logout = async () => {
  try {
    const response = await apiClient.post("/logout/");
    //const { access, refresh } = response.data;
    //localStorage.setItem("access_token", access);
    //localStorage.setItem("refresh_token", refresh);
    //apiClient.defaults.headers["Authorization"] = `Bearer ${access}`;
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false };
  }

  };


  export const register = async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post("/users/", userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration failed:", error.response?.data || error.message);
      } else {
        console.error("An unknown error occurred during registration:", error);
      }
      return { success: false, error };
    }
  };

  
  export const change_password = async (passwordData: {
    current_password: string;
    new_password: string;
}): Promise<{ success: boolean; error?: AxiosError }> => {
    try {
        await apiClient.post("/users/set_password/", passwordData);
        return { success: true };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error };
        }
        return { success: false, error: new Error("Unexpected error") as AxiosError };
    }
};