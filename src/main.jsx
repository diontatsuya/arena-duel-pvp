import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrivyProvider } from '@privy-io/react-auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmcn6y46j00mnl40m3u5bee9v"
      config={{
        loginMethods: ['wallet'],
        appearance: { theme: 'light' }
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
