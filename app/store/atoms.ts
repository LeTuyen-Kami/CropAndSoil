import { atom } from "jotai";
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

export type IOption = {
  id: string;
  name: string;
  code: string;
};

export type Adress = {
  province?: IOption[];
  district?: IOption[];
  ward?: IOption[];
  isOpen: boolean;
  type: "province" | "district" | "ward";
};

export const adressAtom = atom<Adress>({
  province: [],
  district: [],
  ward: [],
  isOpen: false,
  type: "province",
});

export type ConfirmState = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
};

export const confirmAtom = atom<ConfirmState>({
  title: "",
  message: "",
  onConfirm: () => {},
  onCancel: () => {},
  isOpen: false,
});
