import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/HideAppBar';
import {Shopfront} from './components/Shopfront';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';


function App(): JSX.Element {
    console.log("booting app...");
    
    return (
      <div className="App">
        <SnackbarProvider maxSnack={3}>
          <Header />
          <Outlet />
        </SnackbarProvider>
    </div>
  );
}

export default App;
