import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// Views
import { Body } from "./pages/body/body";
import { Header } from './common/header/header';
import { Footer } from './common/footer/footer';


function App() {
  return (
    <>
          <Header />
          <Body />
          <Footer />
    </>
  )
}

export default App
