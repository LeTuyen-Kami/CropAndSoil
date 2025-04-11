import { atom } from "jotai";
import { Token } from "../types";
import { atomWithMMKV } from "./atomWithMMKV";
import { jotaiStore } from "./store";
import { IAddress, User } from "~/services/api/user.service";

interface AuthState {
  isLoggedIn: boolean;
  user: Partial<User> | null;
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
  province?: IOption | null;
  district?: IOption | null;
  ward?: IOption | null;
  isOpen: boolean;
  type: "province" | "district" | "ward";
  data: IOption[];
};

export const adressAtom = atom<Adress>({
  province: null,
  district: null,
  ward: null,
  isOpen: false,
  type: "province",
  data: [],
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

export type IAtomAddress = IAddress & {
  isEdit: boolean;
};

export const initialAddress: IAtomAddress = {
  wooId: 0,
  name: "",
  phoneNumber: "",
  isDefault: false,
  addressLine: "",
  ward: {
    id: "",
    name: "",
    type: "",
    districtId: "",
  },
  district: {
    id: "",
    name: "",
    type: "",
    provinceId: "",
  },
  province: {
    id: "",
    name: "",
    type: "",
    slug: "",
  },
  addressType: "",
  isEdit: false,
};

export const editAddressAtom = atom<IAtomAddress>(initialAddress);
