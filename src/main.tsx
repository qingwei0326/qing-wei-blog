import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyThemeMode, getStoredThemeMode } from '@/lib/theme';
import './styles.css';

applyThemeMode(getStoredThemeMode());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
