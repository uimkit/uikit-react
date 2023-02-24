import { ChatMessageProps } from "./ChatMessage";

export function TextMessage({ message }: ChatMessageProps) {
  return (
    <>
      {message.text}
    </>
  );
};