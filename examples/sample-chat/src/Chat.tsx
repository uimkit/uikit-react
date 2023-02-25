import { useEffect, useState } from 'react';
import { APIClient, UIKit } from '@uimkit/uikit-react';
import UIClient from '@uimkit/uim-js';
import { useAuthok } from '@authok/authok-react';
import '@uimkit/uikit-react/dist/cjs/index.css';

export default function Chat() {
  const { getAccessTokenSilently } = useAuthok();

  const [client, setClient] = useState<APIClient | undefined>();

  useEffect(() => {
    (async function() {
      const accessToken = await getAccessTokenSilently();
      const client = new UIClient(accessToken);
      setClient(client as unknown as APIClient);
    })();
  }, [getAccessTokenSilently]);

  return client ? (
    <UIKit client={client}>
    </UIKit>
  ) : null;
}