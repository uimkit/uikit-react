import { Chat } from "@/components/Chat";
import { getAccessToken, withPageAuthRequired } from '@authok/nextjs-authok';

export default function ChatPage({ accessToken }) {
  return (<Chat accessToken={accessToken} />);
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const { accessToken } = await getAccessToken(req, res);
    return {
      props: { accessToken }
    } 
  }
});
