'use client'
import { useAuthok } from '@authok/authok-react';
import { Chat } from '../Chat';
import styles from './index.module.scss';

export function Main() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuthok();

  return (
    <div className={styles.App}>
      <header className={styles['App-header']}>
          {isAuthenticated ? (
            <button onClick={() => logout({ return_to: window.location.origin })}>注销</button>
          ): (
            <button onClick={() => loginWithRedirect()}>登录</button>
          )}
      </header>
      <main className={styles['App-main']}>
        {isAuthenticated && <Chat/>}
      </main>
    </div>
  );
}