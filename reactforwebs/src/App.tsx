import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Banner';
import {Shopfront} from './components/Shopfront';
import BadgeContext, { CartBadgeContextState, ICartBadgeContext } from './components/Context/CartBadgeContext';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { storageAccessToken } from './components/Services/Axios';
import CartDataService from './components/Services/CartDataService';
import { CartRow } from './components/Interfaces/Cart';


function App(): JSX.Element {
    console.log("booting app...");

    const badgeContext: ICartBadgeContext = useContext(BadgeContext);
    const badgeContextInitialized = useRef<boolean>(false);
    const badgeContextState: ICartBadgeContext = CartBadgeContextState();

    useEffect(() => {
      if (localStorage.getItem(storageAccessToken) && !badgeContextInitialized.current){
        badgeContextInitialized.current = true;
        CartDataService.get()
          .then((response) => {
            console.log("Cart data for BadgeContext was loaded.", response.data);
            const cartRows: CartRow[] = response.data;
            const cartRowQuantities: number[] = cartRows.map((row) => row.quantity);
            badgeContext.init(cartRowQuantities);
          })
          .catch((err) => {
            console.log("ERROR: an error occured while cart data was loading,", err, err.response);
          })
      }
    }, [badgeContext])
    
    return (
      <div className="App">
        <BadgeContext.Provider value={badgeContextState}>
          <SnackbarProvider maxSnack={3}>
            <Header />
            <Outlet />
          </SnackbarProvider>
        </BadgeContext.Provider>
    </div>
  );
}

export default App;
