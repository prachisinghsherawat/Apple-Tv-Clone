import { registeractions } from "./action";
import { restoreSession } from "./mockAuth";

// Seeding from storage keeps the viewer signed in across a page refresh.
const persisted = restoreSession();

const initState = {
  error: "",
  isauthenticated: Boolean(persisted.token),
  loading: false,
  token: persisted.token,
  user: persisted.user,
};

export const loginreducer = (store = initState, { type, payload }) => {
  switch (type) {
    case registeractions.ADD_TOKEN_REQUEST:
      return { ...store, loading: true, error: "" };

    case registeractions.ADD_TOKEN_SUCCESS:
      return {
        ...store,
        loading: false,
        error: "",
        isauthenticated: true,
        token: payload.token,
        user: payload.user,
      };

    case registeractions.ADD_TOKEN_FAILURE:
      return {
        ...store,
        loading: false,
        error: payload?.message || "Sign in failed.",
        isauthenticated: false,
        token: "",
        user: null,
      };

    case registeractions.LOGOUT:
      return { ...initState, token: "", user: null, isauthenticated: false };

    default:
      return store;
  }
};
