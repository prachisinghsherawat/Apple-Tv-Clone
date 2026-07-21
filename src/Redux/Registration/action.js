import { register } from "../Login/mockAuth";
import { addtokenres } from "../Login/action";

export const registeractions = {
  POST_REGISTER_REQUEST: "POST_REGISTER_REQUEST",
  POST_REGISTER_SUCCESS: "POST_REGISTER_SUCCESS",
  POST_REGISTER_FAILURE: "POST_REGISTER_FAILURE",
};

export const postRegisteredreq = () => ({
  type: registeractions.POST_REGISTER_REQUEST,
});

export const postRegisteredres = (data) => ({
  type: registeractions.POST_REGISTER_SUCCESS,
  payload: data,
});

export const postRegisterederror = (message) => ({
  type: registeractions.POST_REGISTER_FAILURE,
  payload: { message },
});

export const registernuser = (user) => (dispatch) => {
  dispatch(postRegisteredreq());

  return register(user)
    .then((session) => {
      dispatch(postRegisteredres(session.user));
      // Registering signs the new account straight in.
      dispatch(addtokenres(session));
      return session;
    })
    .catch((error) => {
      const message = error?.message || "Could not create your Apple ID.";
      dispatch(postRegisterederror(message));
      throw new Error(message);
    });
};
