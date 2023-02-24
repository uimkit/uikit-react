import { useEffect, useState } from 'react';
import { UIKit } from '@uimkit/uikit-react';
import UIClient from '@uimkit/uim-js';
import { useAuthok } from '@authok/authok-react';

export default function Chat() {
  const { getAccessTokenSilently } = useAuthok();

  const [client, setClient] = useState<UIClient | undefined>();

  useEffect(() => {
    (async function() {
      const accessToken = await getAccessTokenSilently();
      const client = new UIClient(accessToken);
      setClient(client);
    })();
  }, [getAccessTokenSilently]);

  return client ? (
    <UIKit client={client}>
    </UIKit>
  ) : null;
}