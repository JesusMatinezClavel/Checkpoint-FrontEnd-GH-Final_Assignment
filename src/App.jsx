import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// Views
import { Home } from './views/home/home'
import { Header } from './common/header/header';
import { Footer } from './common/footer/footer';

function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  )
}

export default App
