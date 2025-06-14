import { atom } from "jotai";
import { Token } from "../types";
import { atomWithMMKV } from "./atomWithMMKV";
import { jotaiStore } from "./store";
import { IAddress, User } from "~/services/api/user.service";
import { IVoucher } from "~/services/api/voucher.service";
import dayjs from "dayjs";

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
  jotaiStore.set(selectedVoucherAtom, {
    voucher: null,
    canSelect: false,
  });
  jotaiStore.set(editAddressAtom, initialAddress);
  jotaiStore.set(selectedAddressAtom, null);
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

export const showModalConfirm = ({
  title,
  message,
  onConfirm,
  onCancel,
}: Omit<ConfirmState, "isOpen">) => {
  jotaiStore.set(confirmAtom, {
    title,
    message,
    onConfirm,
    onCancel,
    isOpen: true,
  });
};

export type IAtomAddress = IAddress & {
  isEdit: boolean;
};

export const initialAddress: IAtomAddress = {
  id: 0,
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

export interface IVoucherState {
  voucher: IVoucher | null;
  canSelect: boolean;
}

export const selectedVoucherAtom = atom<IVoucherState>({
  voucher: null,
  canSelect: false,
});

type DevMode = {
  showNetworkLogger: boolean;
  enableSentry: boolean;
  enableOptimalProductImage: boolean;
  networkLoggerSecurityPin: string;
  networkLoggerUnlocked: boolean;
  updatedAt: string;
};

export const initialDevMode: DevMode = {
  showNetworkLogger: false,
  enableSentry: true,
  enableOptimalProductImage: false,
  networkLoggerSecurityPin: "2024",
  networkLoggerUnlocked: false,
  updatedAt: dayjs().toISOString(),
};

export const devModeAtom = atomWithMMKV<DevMode>("devMode", initialDevMode);

export const resetDevMode = () => {
  jotaiStore.set(devModeAtom, {
    ...initialDevMode,
    updatedAt: dayjs().toISOString(),
  });
};

export const selectedAddressAtom = atomWithMMKV<IAddress | null>(
  "selectedAddress",
  null
);
