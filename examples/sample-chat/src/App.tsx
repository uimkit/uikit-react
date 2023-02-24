import React from 'react';
import { AuthokProvider } from "@authok/authok-react";
import Main from './Main';

function App() {
  return (
    <AuthokProvider
      domain="https://uim.cn.authok.cn"
      clientId="Fb4VkNXrl4m8JwSLu2bNpMTP9eDjXb7V"
      redirectUri={window.location.origin}
    >
      <Main />
    </AuthokProvider>
  );
}

export default App;
