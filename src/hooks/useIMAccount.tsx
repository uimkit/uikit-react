import { useEffect } from 'react';
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { IMAccount } from '../types';
import { fetchAccount, getAccountById } from '../store/accounts';
import { AppState } from '../store/types';

export function useIMAccount(accountId: string): IMAccount | undefined {
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchAccount(accountId))
    }
  }, [accountId]);

  return useSelector<AppState, IMAccount>(getAccountById(accountId));
}