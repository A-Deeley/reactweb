import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthRoutes from './Auth/AuthRoutes';
import AuthContainer from './Auth/AuthContainer';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Logout from './Auth/Logout';
import ProtectedRoutes from './ProtectedRoutes';
import Cart from './components/CartContainer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="">
                    {/*<Route path="product/:id" element={< />} />*/}
                    <Route path="/" element={<App />} />
                    <Route path="" element={<ProtectedRoutes />}>
                        <Route path="panier" element={<Cart />} />
                    </Route>
                </Route>
                <Route path="/auth" element={<AuthRoutes />}>
                    <Route path="" element={<AuthContainer />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                    </Route>
                    <Route path="logout" element={<Logout />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
