import { useCallback } from 'react';
import { useDispatch } from '../store/useDispatch';

export interface UseDeleteContactResult {
  mutate: (contactId: string) => void;
}

export function useDeleteContact(): UseDeleteContactResult {
  const dispatch = useDispatch();
  
  const mutate = useCallback((contactId) => {
    // dispatch(deleteContact(contactId))
  }, []);

  return {
    mutate,
  };
}