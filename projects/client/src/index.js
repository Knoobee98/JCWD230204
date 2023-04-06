import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/css/index.css';
import App from './App';
import AppAdmin from './appAdmin'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './helpers/scrollToTop';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

