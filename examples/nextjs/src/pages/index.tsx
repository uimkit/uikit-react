import { useUser } from '@authok/nextjs-authok/client';
import styles from './index.module.scss';

export default function Index() {
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
        {user && <a href="/chat">进入聊天</a>}
      </main>
    </div>
  );
}