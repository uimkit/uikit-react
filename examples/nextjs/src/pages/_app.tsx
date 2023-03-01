import React from 'react';
import type { AppProps } from 'next/app';
import { UserProvider } from '@authok/nextjs-authok/client';

export default function App({ Component, pageProps }: AppProps): React.ReactElement<AppProps> {
  const { user } = pageProps;

  const Layout = Component['layout'] ? Component['layout'] : ({ children }) => <>{children}</>;

  return (
    <UserProvider user={user}>
      <Layout><Component {...pageProps} /></Layout>
    </UserProvider>
  );
}