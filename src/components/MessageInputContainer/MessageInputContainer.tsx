import { ChatToolBar } from "./ChatToolBar";
import { UIMessageInput } from "../UIMessageInput";


export default function MessageInputContainer() {
  return (
    <div className="MessageInput">
      <ChatToolBar />
      <UIMessageInput />
    </div>
  );
}