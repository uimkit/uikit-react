import { APIClient } from "../../types";

export const INIT_CLIENT = "INIT_CLIENT";

export interface InitAPIClientAction {
	type: typeof INIT_CLIENT;
	payload: APIClient;
}

export const initAPIClient = (client: APIClient) => {
  return async dispatch => {
    dispatch({
      type: INIT_CLIENT,
      payload: client,
    });
  };
};

export type CommonActions =
	| InitAPIClientAction;
