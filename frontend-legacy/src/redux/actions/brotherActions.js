import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../../util/setAuthToken';

import {
  GET_ERRORS,
  SET_CURRENT_BROTHER,
  REGISTER_BROTHER,
  EDIT_BROTHER,
} from './types';

/**
 * Register Brother action
 * @param {*} brotherData register inputs
 */
export const registerBrother = (brotherData) => (dispatch) => {
  const formData = makeFormData(brotherData);
  axios
    .post(`${process.env.BACKEND_API_URL}/api/brothers/register`, formData)
    .then((response) => {
      console.log(response);
      dispatch(updateRegisterSuccessMessage(brotherData.name));
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      });
    });
};

// Creates a FormData object to pass to Register endpoint (allows for file inputs)
export const makeFormData = (brotherData) => {
  const formData = new FormData();
  const entries = Object.entries(brotherData);

  for (const [key, value] of entries) {
    formData.append(key, value);
  }
  return formData;
};

// Helper function: when someone registers a user, this helps showing the success message
export const updateRegisterSuccessMessage = (registeredBrother) => {
  return {
    type: REGISTER_BROTHER,
    payload: {
      registeredBrother,
    },
  };
};

/**
 * LOGIN Brother endpoint
 * @param {*} brotherData login inputs
 */
export const loginBrother = (brotherData) => (dispatch) => {
  axios
    .post(`${process.env.BACKEND_API_URL}/api/brothers/login`, brotherData)
    .then((response) => {
      // Store token in localStorage, then as auth header in all axios requests
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      setAuthToken(token);

      // Decode token to get user data in payload, then store in redux state
      const decodedToken = jwtDecode(token);
      dispatch(setCurrentBrother(decodedToken));
    })
    .catch((error) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      dispatch({ type: GET_ERRORS, payload: error.response.data })
    );
};

// Helper function: this sets the currently logged in user
export const setCurrentBrother = (decodedToken) => {
  return {
    type: SET_CURRENT_BROTHER,
    payload: decodedToken,
  };
};

/**
 * EDIT Brother action
 * @param {*} brotherData edit inputs
 */
export const editBrother = (brotherId, brotherName, editedFields) => (
  dispatch
) => {
  axios
    .put(`${process.env.BACKEND_API_URL}/api/brothers/me`, editedFields)
    .then((response) => {
      console.log(response);
      dispatch(updateEditSuccessMessage(brotherName));
    })
    .catch((error) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      dispatch({ type: GET_ERRORS, payload: error.response.data })
    );
};

// Helper function: when someone edits their profile, this helps showing the success message
export const updateEditSuccessMessage = (editedBrother) => {
  return {
    type: EDIT_BROTHER,
    payload: {
      editedBrother,
    },
  };
};

/**
 * LOGOUT Brother action
 */
export const logoutBrother = () => (dispatch) => {
  // Remove JWT from localStorage, auth header, and clear current logged-in brother
  localStorage.removeItem('authToken');
  setAuthToken(false);
  dispatch(setCurrentBrother({}));
};