import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { userService } from "~/services/api/user.service";
import { authAtom } from "~/store/atoms";
import useFirebase from "./useFirebase";
const useUpdateFCMToken = () => {
  const auth = useAtomValue(authAtom);
  const { token } = useFirebase();

  console.log("token", token);

  useEffect(() => {
    if (!auth?.isLoggedIn || !token) return;

    userService.changeDeviceToken({
      deviceToken: token || "",
    });
  }, [auth?.isLoggedIn, token]);
};

export default useUpdateFCMToken;
