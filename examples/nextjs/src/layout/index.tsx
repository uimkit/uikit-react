import { useUser } from '@authok/nextjs-authok/client';
import styles from './index.module.scss';


export function Layout({ children }) {
  const { user, error, isLoading } = useUser();

  return (
    <div className={styles.App}>
      <header className={styles['App-header']}>
          {user ? (
            <a href="/api/auth/logout">注销</a>
          ): (
            <a href="/api/auth/login">登录</a>
          )}
      </header>
      <main className={styles['App-main']}>
        {children}
      </main>
    </div>
  );
}