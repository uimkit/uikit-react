import { UIMessageProps } from ".";

export function ImageMessage({ message }: UIMessageProps) {
  return (
    <>
      <img src={message.image?.url} alt="" />
    </>
  );
};