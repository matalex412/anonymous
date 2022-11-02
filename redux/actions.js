// action types
export const UPDATE_APP_DATA = "UPDATE_APP_DATA";

// action creators
export const updateAppData = (update) => ({
	type: UPDATE_APP_DATA,
	payload: update,
});
