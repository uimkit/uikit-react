import { useUIKit } from '../..';
import { useIMAccountList } from '../../hooks/useIMAccountList';
import { Avatar } from '../Avatar';



export function UIAccountList() {
  const { setActiveAccount } = useUIKit();

  const accounts = useIMAccountList();

  const changeAccount = (account) => {
    setActiveAccount(account);
  };

  return (
    <div>
      <ul>
        {accounts.map(account => (
          <li onClick={() => changeAccount(account)}>
            <Avatar image={account.avatar} />
            {account.name}
          </li>
        ))}
      </ul>
    </div>
  );
}