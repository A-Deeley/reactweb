import { AxiosResponse } from 'axios';
import axiosInstance, { setLocalToken, unsetLocalToken } from './Axios';
import IUserData, { IAuthData } from '../Interfaces/IUserData';

const login = (username: string, password: string): Promise<boolean> => {
  const promise = new Promise<boolean>((resolve, reject) => {
    axiosInstance
      .post('auth/token/', { username, password })
      .then((response) => {
        const authData: IAuthData = response.data;
        setLocalToken(authData);
        console.log('Successful login');
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  })
  return promise;
}

const logout = (): Promise<boolean> => {
  const promise = new Promise<boolean>((resolve, reject) => {
    unsetLocalToken();
    console.log('Successful logout');
    resolve(true);
  });
  return promise;
}

const register = (
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
): Promise<AxiosResponse<IUserData>> =>
  axiosInstance.post<unknown, AxiosResponse<IUserData>>(
    'auth/register/', { first_name: firstname, last_name: lastname, username, email, password });


const AccountDataService = {
  login,
  logout,
  register,
}

export default AccountDataService;
