import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const domain = import.meta.env.VITE_DOMAIN;
const client_id = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={client_id}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    </Auth0Provider>
  </StrictMode>,
)
