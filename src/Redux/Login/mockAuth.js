/**
 * Local stand-in for an auth backend.
 *
 * The original actions posted to a Heroku app that no longer exists, so every
 * sign-in failed. This keeps the same async shape (promise in, token out) but
 * resolves against localStorage, so the demo is self-contained and sign-in
 * actually works. Swap this module for real HTTP calls and nothing else in the
 * Redux layer has to change.
 *
 * Passwords are stored in plain text in the browser. That is acceptable only
 * because this is a mock with no real accounts behind it — never do this against
 * credentials that mean anything.
 */

const USERS_KEY = "tvapple.users";
const SESSION_KEY = "tvappletoken";
const USER_KEY = "tvapple.user";

// A little latency keeps the loading states in the UI honest.
const LATENCY_MS = 550;

const delay = (value, ok = true) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (ok ? resolve(value) : reject(value)), LATENCY_MS)
  );

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

const makeToken = (email) =>
  // Not a real JWT — just an opaque, stable-per-session string.
  btoa(`${email}:${Date.now()}`).replace(/=/g, "");

/** A demo account so the sign-in screen is usable without registering first. */
const DEMO = {
  name: "Demo Viewer",
  email: "demo@apple.com",
  password: "appletv",
};

const seedDemoUser = () => {
  const users = readUsers();
  if (!users.some((user) => user.email === DEMO.email)) {
    writeUsers([...users, DEMO]);
  }
};

export const signIn = ({ email, password }) => {
  seedDemoUser();

  if (!email || !password) {
    return delay({ message: "Enter both your Apple ID and password." }, false);
  }

  const account = readUsers().find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!account || account.password !== password) {
    return delay({ message: "Incorrect Apple ID or password." }, false);
  }

  const session = {
    token: makeToken(account.email),
    user: { name: account.name, email: account.email },
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session.token));
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  return delay(session);
};

export const register = ({ name, email, password }) => {
  seedDemoUser();

  if (!name || !email || !password) {
    return delay({ message: "All fields are required." }, false);
  }
  if (password.length < 6) {
    return delay({ message: "Password must be at least 6 characters." }, false);
  }

  const users = readUsers();
  if (users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
    return delay({ message: "That Apple ID is already in use." }, false);
  }

  const account = { name, email: email.trim(), password };
  writeUsers([...users, account]);

  const session = {
    token: makeToken(account.email),
    user: { name: account.name, email: account.email },
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session.token));
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  return delay(session);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
};

/** Rehydrates Redux on boot so a refresh does not sign the viewer out. */
export const restoreSession = () => {
  try {
    return {
      token: JSON.parse(localStorage.getItem(SESSION_KEY)) || "",
      user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
    };
  } catch {
    return { token: "", user: null };
  }
};

export const DEMO_CREDENTIALS = { email: DEMO.email, password: DEMO.password };
