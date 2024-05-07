import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap
import { Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';

// Views
import { Body } from "./pages/body/body";
import { Header } from './common/header/header';
import { Footer } from './common/footer/footer';


function App() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Header />
          <Body />
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
