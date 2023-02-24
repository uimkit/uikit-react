import React from 'react';
import { AuthokProvider } from "@authok/authok-react";
import Main from './Main';

function App() {
  return (
    <AuthokProvider
      domain="https://uim.cn.authok.cn"
      clientId="Fb4VkNXrl4m8JwSLu2bNpMTP9eDjXb7V"
      audience="https://api.uimkit.chat/client/v1"
      redirectUri={window.location.origin}
    >
      <Main />
    </AuthokProvider>
  );
}

export default App;
