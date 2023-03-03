import { Navigate, Outlet } from 'react-router-dom';

const useAuth = (): boolean => {
  const accessToken: string | null = localStorage.getItem('demo_access_token');
  return accessToken !== null;
}

export default function ProtectedRoutes(): JSX.Element | null {
  const isAuth: boolean = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/auth/login" />;
}
