import { useEffect } from "react";
import { useAtom } from "jotai";
import { devModeAtom } from "~/store/atoms";
import dayjs from "dayjs";
import { getDeviceId } from "~/utils";

const useSyncDevMode = () => {
  const [devMode, setDevMode] = useAtom(devModeAtom);

  const checkDate = (localDate?: string, dataDate?: string) => {
    if (!localDate || !dataDate) {
      return true;
    }

    return dayjs(dataDate).isAfter(dayjs(localDate));
  };

  useEffect(() => {
    const localDeviceId = getDeviceId();

    fetch("https://rainbow-freezing-antlion.glitch.me")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { enableNetworkLogger, enableSentry, deviceId, updatedAt } =
          data || {};

        if (!!deviceId) {
          if (
            deviceId === localDeviceId &&
            checkDate(devMode.updatedAt, updatedAt)
          ) {
            setDevMode({
              ...devMode,
              showNetworkLogger: enableNetworkLogger ?? false,
              networkLoggerUnlocked: enableNetworkLogger ?? false,
              enableSentry: enableSentry ?? true,
              updatedAt: dayjs(updatedAt).toISOString(),
            });
          }
        } else {
          if (checkDate(devMode.updatedAt, updatedAt)) {
            setDevMode({
              ...devMode,
              showNetworkLogger: enableNetworkLogger ?? false,
              networkLoggerUnlocked: enableNetworkLogger ?? false,
              enableSentry: enableSentry ?? true,
              updatedAt: dayjs(updatedAt).toISOString(),
            });
          }
        }
      })
      .catch((err) => {
        console.log("err123", err);
      });
  }, []);
};

export default useSyncDevMode;
