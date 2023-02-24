import { useRef } from 'react'
import { useSelector } from "react-redux";
import { ChatState, getChatState } from "../store/chatState";
import { AppState } from "../store/types";


export function useChatState(): ChatState {
  const messageListRef = useRef(null);
  const textareaRef = useRef(null);

  const state = useSelector<AppState, ChatState>(getChatState);

  return {
    ...state,
    textareaRef,
    messageListRef,
  }
}