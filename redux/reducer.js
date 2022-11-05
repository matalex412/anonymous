import { combineReducers } from "redux";
import { UPDATE_APP_DATA } from "./actions";

const appDataReducer = (
  state = {
    anonID: "",
  },
  action
) => {
  switch (action.type) {
    case UPDATE_APP_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer = combineReducers({
  appData: appDataReducer,
});
