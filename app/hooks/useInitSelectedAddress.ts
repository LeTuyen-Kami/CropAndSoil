import { useAtomValue } from "jotai";
import { selectedAddressAtom } from "~/store/atoms";
import { useEffect } from "react";
import { jotaiStore } from "~/store/store";
import { userService } from "~/services/api/user.service";
import { useQuery } from "@tanstack/react-query";

const useInitSelectedAddress = () => {
  const selectedAddress = useAtomValue(selectedAddressAtom);

  const { data: address } = useQuery({
    queryKey: ["payment-address"],
    queryFn: () => userService.getAddress({ skip: 0, take: 1 }),
    select: (data) => data.data?.[0] || null,
    enabled: !selectedAddress,
  });

  useEffect(() => {
    if (address && !selectedAddress) {
      jotaiStore.set(selectedAddressAtom, address);
    }
  }, [address]);
};

export default useInitSelectedAddress;
