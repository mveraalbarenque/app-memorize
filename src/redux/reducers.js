// reducers.js
import {
  FETCH_SVG_REQUEST,
  FETCH_SVG_SUCCESS,
  FETCH_SVG_FAILURE,
} from "./actions";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const usersReducer = (state = initialState, action) => {
  const { type, payload } = action;

  const LISTADO = {
    FETCH_SVG_REQUEST: {
      ...state,
      loading: true,
    },
    FETCH_SVG_SUCCESS: {
      ...state,
      loading: false,
      users: payload,
      error: null,
    },
    FETCH_SVG_FAILURE: {
      ...state,
      loading: false,
      error: payload,
    },
  };

  return LISTADO[type] || state;
};

export default usersReducer;
