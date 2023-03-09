import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/HideAppBar';
import {Shopfront} from './components/Shopfront';


function App(): JSX.Element {
    console.log("booting app...");
    
    return (
      <div className="App">
          <Header />
          <Shopfront />
    </div>
  );
}

export default App;
