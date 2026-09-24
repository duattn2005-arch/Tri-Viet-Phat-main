import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The CRM dashboard lives at /crm (or #crm) and is loaded on demand so the public site stays light.
const CrmDashboard = lazy(() => import('./crm/CrmDashboard.tsx'));
const isCrm = window.location.pathname.startsWith('/crm') || window.location.hash === '#crm';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCrm ? (
      <Suspense fallback={null}>
        <CrmDashboard />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
