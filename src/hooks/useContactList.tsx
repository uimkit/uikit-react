import { useEffect } from 'react';
import { Contact } from "../types";
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { AppState } from '../store/types';
import { fetchContactsByAccount, getContactsByAccount } from '../store/contacts';

export interface UseContactListResult {
  contacts: Contact[];
}

export function useContactList(accountId: string): UseContactListResult {
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchContactsByAccount(accountId))
    }
  }, [accountId]);

  const contacts = useSelector<AppState, Contact[]>(getContactsByAccount(accountId));

  return {
    contacts,
  };
}