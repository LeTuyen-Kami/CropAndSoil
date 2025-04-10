import { atom } from "jotai";

export interface AddressType {
  type: "office" | "home";
  isDefault: boolean;
}

export interface TodoFormState {
  fullName: string;
  phoneNumber: string;
  phoneError?: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  addressType: AddressType;
}

export const initialFormState: TodoFormState = {
  fullName: "",
  phoneNumber: "",
  phoneError: undefined,
  province: "",
  district: "",
  ward: "",
  streetAddress: "",
  addressType: {
    type: "office",
    isDefault: false,
  },
};

// Individual atoms for each field to prevent re-renders
export const fullNameAtom = atom<string>("");
export const phoneNumberAtom = atom<string>("");
export const phoneErrorAtom = atom<string | undefined>(undefined);
export const provinceAtom = atom<string>("");
export const districtAtom = atom<string>("");
export const wardAtom = atom<string>("");
export const streetAddressAtom = atom<string>("");
export const addressTypeAtom = atom<AddressType>({
  type: "office",
  isDefault: false,
});

// Derived atom that combines all values
export const formStateAtom = atom(
  (get) => ({
    fullName: get(fullNameAtom),
    phoneNumber: get(phoneNumberAtom),
    phoneError: get(phoneErrorAtom),
    province: get(provinceAtom),
    district: get(districtAtom),
    ward: get(wardAtom),
    streetAddress: get(streetAddressAtom),
    addressType: get(addressTypeAtom),
  }),
  (_get, set, newState: Partial<TodoFormState>) => {
    if (newState.fullName !== undefined) set(fullNameAtom, newState.fullName);
    if (newState.phoneNumber !== undefined)
      set(phoneNumberAtom, newState.phoneNumber);
    if (newState.phoneError !== undefined)
      set(phoneErrorAtom, newState.phoneError);
    if (newState.province !== undefined) set(provinceAtom, newState.province);
    if (newState.district !== undefined) set(districtAtom, newState.district);
    if (newState.ward !== undefined) set(wardAtom, newState.ward);
    if (newState.streetAddress !== undefined)
      set(streetAddressAtom, newState.streetAddress);
    if (newState.addressType !== undefined)
      set(addressTypeAtom, newState.addressType);
  }
);

// Helper function to validate phone number
export const validatePhoneNumber = (
  phoneNumber: string
): string | undefined => {
  if (!phoneNumber) return "Số điện thoại không được để trống";
  if (!/^(0|\+84)\d{9}$/.test(phoneNumber)) {
    return "Sai số điện thoại. Vui lòng thử lại.";
  }
  return undefined;
};
