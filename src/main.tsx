
// Bulletproof one-time hard reset of localStorage to clear all stale product states
if (!localStorage.getItem('meraki_hard_reset_v26')) {
  localStorage.clear();
  localStorage.setItem('meraki_hard_reset_v26', '26');
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
