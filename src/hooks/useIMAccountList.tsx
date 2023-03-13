import { useEffect } from 'react';
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { IMAccount } from '../types';
import { fetchAllAccounts, getAccounts } from '../store/accounts';
import { AppState } from '../store/types';

export function useIMAccountList(componentName?: string): IMAccount[] {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllAccounts())
  }, [componentName]);

  return useSelector<AppState, IMAccount[]>(getAccounts);
}