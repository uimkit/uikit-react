import { APIClient } from "../../types";
import { CommonActions, INIT_CLIENT } from "./actions";

export type CommonState = {
  client?: APIClient;
};

const createInitialState = (): CommonState => ({})

export const createCommonReducer = () => (
	state: CommonState = createInitialState(),
	action: CommonActions,
): CommonState => {
	switch (action.type) {
		case INIT_CLIENT: {
			return {
        ...state,
        client: action.payload,
      };
		}
		default:
			return state;
	}
}

const CommonReducer = createCommonReducer()

export { CommonReducer }