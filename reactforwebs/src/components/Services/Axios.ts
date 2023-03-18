import axios from 'axios';
import { IAuthData } from '../Interfaces/IUserData';

export const baseURL = (process.env.NODE_ENV === 'development') ? 'http://localhost:8000/' : 'https://shopapi.web4.lesbiscuits.ca';
const headerToken = 'Bearer ';
export const storageAccessToken = 'demo_access_token';

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
  headers: {
    'Authorization': localStorage.getItem('demo_access_token')
      ? headerToken + localStorage.getItem('demo_access_token')
      : null,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const setLocalToken = (authData: IAuthData): void => {
  localStorage.setItem('demo_access_token', authData.access);
  localStorage.setItem('demo_refresh_token', authData.refresh);
  localStorage.setItem('demo_user_name', authData.user.first_name);
  axiosInstance.defaults.headers.Authorization = headerToken + authData.access;
}

export const unsetLocalToken = (): void => {
  localStorage.removeItem('demo_access_token');
  localStorage.removeItem('demo_refresh_token');
  localStorage.removeItem('demo_user_name');
  axiosInstance.defaults.headers.Authorization = null;
}


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          if (error.response.data.code === 'token_not_valid') {
            const refreshToken: string | null = localStorage.getItem('demo_refresh_token');

            if (refreshToken) {
              const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

              // exp date in token is expressed in seconds, while now() returns milliseconds:
              const now = Math.ceil(Date.now() / 1000);
              
              if (tokenParts.exp > now) {
                return axiosInstance
                  .post('auth/token-refresh/', { refresh: refreshToken })
                  .then((response) => {
                    console.log('Axios - Access token refreshed');
                    localStorage.setItem('demo_access_token', response.data.access);
                    if (response.data.refresh) {
                      localStorage.setItem('demo_refresh_token', response.data.refresh);
                    }

                    axiosInstance.defaults.headers.Authorization =  headerToken + response.data.access;
                    if (error.config) {
                      error.config.headers.Authorization = headerToken + response.data.access;
                      return axiosInstance(error.config);
                    } else {
                      console.log('Axios error.config is null - auth/token-refresh/')
                    }
                  })
                  .catch((err) => {
                    console.log('Axios error handler - auth/token-refresh/', err, err.response)
                  });
              }
              unsetLocalToken();
            }
          }
          if (error.config?.url !== 'auth/token/') {
            window.location.href = '/auth/login/';
          }
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
