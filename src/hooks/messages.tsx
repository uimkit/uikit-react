import { useCallback } from 'react';
import { useDispatch } from '../store/useDispatch';
import { deleteMessage } from '../store/messages';
import { Message } from '../types';



export const messages = {
  delete: {
    useMutation: function() {
      const dispatch = useDispatch();
      
      const mutate = useCallback((message: Message)=> {
        console.log('删除消息: ', message);
        dispatch(deleteMessage(message));
      }, []);
      
      const error = null; // TODO

      return {
        mutate,
        error,
      }
    }
  }
}