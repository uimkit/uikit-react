import { UIMessageProps } from "./UIMessage";

export function TextMessage({ message }: UIMessageProps) {
  return (
    <>
      {message.text}
    </>
  );
};
