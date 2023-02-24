import { useAuthok } from '@authok/authok-react';
import Chat from './Chat';
import './App.scss';

export default function Main() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuthok();

  return (
    <div className="App">
      <header className="App-header">
          {isAuthenticated ? (
            <button onClick={() => logout({ return_to: window.location.origin })}>注销</button>
          ): (
            <button onClick={() => loginWithRedirect()}>登录</button>
          )}
      </header>
      <main>
        {isAuthenticated && <Chat/>}
      </main>
    </div>
  );
}