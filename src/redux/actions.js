// actions.js
export const FETCH_SVG_REQUEST = "FETCH_SVG_REQUEST";
export const FETCH_SVG_SUCCESS = "FETCH_SVG_SUCCESS";
export const FETCH_SVG_FAILURE = "FETCH_SVG_FAILURE";

export const fetchUsersRequest = () => ({
  type: FETCH_SVG_REQUEST,
});

export const fetchUsersSuccess = (users) => ({
  type: FETCH_SVG_SUCCESS,
  payload: users,
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_SVG_FAILURE,
  payload: error,
});
