// Styles
import './index.css'

// Methods/Modules
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'

// Redux
import { Provider } from "react-redux";
import store from "./app/store.js";

// Redux Persistence
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Instances
const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
