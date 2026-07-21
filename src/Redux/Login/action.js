import { clearSession, signIn } from "./mockAuth";

export const registeractions = {
  ADD_TOKEN_REQUEST: "ADD_TOKEN_REQUEST",
  ADD_TOKEN_SUCCESS: "ADD_TOKEN_SUCCESS",
  ADD_TOKEN_FAILURE: "ADD_TOKEN_FAILURE",
  LOGOUT: "LOGOUT",
};

export const addtokenreq = () => ({ type: registeractions.ADD_TOKEN_REQUEST });

export const addtokenres = (session) => ({
  type: registeractions.ADD_TOKEN_SUCCESS,
  payload: session,
});

export const addtokenerr = (message) => ({
  type: registeractions.ADD_TOKEN_FAILURE,
  payload: { message },
});

export const logout = () => {
  clearSession();
  return { type: registeractions.LOGOUT };
};

/**
 * Resolves with the session on success and rejects with a message on failure,
 * so the modal can render an inline error instead of the old `alert()` calls.
 */
export const getusertoken = (credentials) => (dispatch) => {
  dispatch(addtokenreq());

  return signIn(credentials)
    .then((session) => {
      dispatch(addtokenres(session));
      return session;
    })
    .catch((error) => {
      const message = error?.message || "Unable to sign in. Please try again.";
      dispatch(addtokenerr(message));
      throw new Error(message);
    });
};
