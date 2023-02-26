import { useEffect, useCallback } from 'react';
import { Contact } from "../types";
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { AppState } from '../store/types';
import { ContactListIndexedByAccount, fetchContactsByAccount, getContactsByAccount, getContactsByAccountState, hasMoreContactsByAccount, isFetchingContactsByAccount } from '../store/contacts';

export interface UseContactListResult {
  contacts?: Contact[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  error?: Error;
}

export function useContactList(accountId: string): UseContactListResult {
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchContactsByAccount(accountId))
    }
  }, [accountId]);

  const loadMore = useCallback(() => {
    if (accountId) {
      dispatch(fetchContactsByAccount(accountId, true))
    }
  }, [accountId]);

  const { contacts, loading, cursor, error } = useSelector<AppState, ContactListIndexedByAccount>(getContactsByAccountState(accountId));

  return {
    loadMore,
    hasMore: cursor?.has_next ?? false,
    loading,
    contacts,
    error,
  };
}