import { useEffect, useCallback } from 'react';
import { Contact } from "../types";
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { AppState } from '../store/types';
import { fetchContactsByAccount, getContactsByAccount, hasMoreContactsByAccount, isFetchingContactsByAccount } from '../store/contacts';

export interface UseContactListResult {
  contacts: Contact[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
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

  const hasMore = useSelector(hasMoreContactsByAccount(accountId))

  const loading = useSelector(isFetchingContactsByAccount(accountId));

  const contacts = useSelector<AppState, Contact[]>(getContactsByAccount(accountId));

  return {
    hasMore,
    loading,
    contacts,
    loadMore,
  };
}