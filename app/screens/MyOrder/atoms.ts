import { atom } from "jotai";

export const modalRefundAtom = atom<{
  visible: boolean;
  orderId: number | null;
  onSuccess: () => void;
}>({
  visible: false,
  orderId: null,
  onSuccess: () => {},
});
