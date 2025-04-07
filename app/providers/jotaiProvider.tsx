import { Provider } from "jotai";
import { jotaiStore } from "~/store/store";

const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={jotaiStore}>{children}</Provider>;
};

export default JotaiProvider;
