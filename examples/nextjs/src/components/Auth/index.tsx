'use client'
import { AuthokProvider } from "@authok/authok-react";

export function Auth({ children }) {  
  return (
    <AuthokProvider
      domain="https://uim.cn.authok.cn"
      clientId="Fb4VkNXrl4m8JwSLu2bNpMTP9eDjXb7V"
      audience="https://api.uimkit.chat/client/v1"
      redirectUri={window.location.origin}
    >
      {children}
    </AuthokProvider>
  );
}