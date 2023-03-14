import { Chat } from '@/components/Chat';
import { Layout } from '@/layout';
import { getAccessToken, withPageAuthRequired } from '@authok/nextjs-authok';


export default function IndexPage({ accessToken }) {
  return (<Chat accessToken={accessToken} />);
}

IndexPage.layout = Layout;

export const getServerSideProps = withPageAuthRequired({ 
  async getServerSideProps({ req, res }) {
    const { accessToken } = await getAccessToken(req, res);
    return {
      props: { accessToken }
    };
  },
});