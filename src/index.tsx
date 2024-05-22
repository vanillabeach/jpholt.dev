import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <App />
  </>
);

console.log(
  '%c★ Hi Engineer! Checkout the source at https://github.com/vanillabeach/jpholt.dev ★',
  'background: black; color: white; padding: 10px; font-size: large'
);
