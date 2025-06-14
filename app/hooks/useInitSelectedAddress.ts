import { useAtomValue } from "jotai";
import { authAtom, selectedAddressAtom } from "~/store/atoms";
import { useEffect } from "react";
import { jotaiStore } from "~/store/store";
import { userService } from "~/services/api/user.service";
import { useQuery } from "@tanstack/react-query";

const useInitSelectedAddress = () => {
  const selectedAddress = useAtomValue(selectedAddressAtom);
  const auth = useAtomValue(authAtom);

  const { data: address } = useQuery({
    queryKey: ["payment-address", auth?.token?.accessToken],
    queryFn: () => userService.getAddress({ skip: 0, take: 1 }),
    select: (data) => data.data?.[0] || null,
    enabled: !!auth?.token?.accessToken && !selectedAddress,
  });

  useEffect(() => {
    if (!auth?.token?.accessToken || !auth?.isLoggedIn) {
      return;
    }

    if (address && !selectedAddress) {
      jotaiStore.set(selectedAddressAtom, address);
    }
  }, [address, auth?.token?.accessToken]);
};

export default useInitSelectedAddress;
