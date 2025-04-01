import { atom } from "jotai";

type IStep = "signIn" | "signUp" | "resetPassword";

type ILoginAtom = {
  step: IStep;
  previousStep: IStep | null;
  countdown: number;
};

export const loginAtom = atom<Partial<ILoginAtom>>({
  step: "signIn",
  previousStep: null,
  countdown: 60,
});
