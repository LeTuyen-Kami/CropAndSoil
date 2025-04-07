import { Token, User } from "../types";
import { atomWithMMKV } from "./atomWithMMKV";
import { jotaiStore } from "./store";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: Token | null;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

export const authAtom = atomWithMMKV<AuthState>("auth", initialAuthState);

export const signOut = () => {
  jotaiStore.set(authAtom, initialAuthState);
};

export const signIn = (data: Partial<AuthState>) => {
  const currentState = jotaiStore.get(authAtom);
  jotaiStore.set(authAtom, { ...currentState, ...data });
};
