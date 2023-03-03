import { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import AccountDataService from '../components/Services/AccountDataService';

export default function Logout(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    AccountDataService.logout()
    navigate('/')
  });

  return <div />;
}
