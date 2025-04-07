import { atom } from "jotai";
import { LoginStep } from "~/hooks/useStepAnimation";

type ILoginAtom = {
  step: LoginStep;
  previousStep: LoginStep | null;
  countdown: number;
};

export const loginAtom = atom<Partial<ILoginAtom>>({
  step: "signIn",
  previousStep: null,
  countdown: 60,
});
