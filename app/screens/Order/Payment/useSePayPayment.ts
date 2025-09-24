import { useCallback } from "react";
import { toast } from "~/components/common/Toast";

interface UseSePayPaymentProps {
  onSuccess: () => void;
  onFailed: () => void;
}

const useSePayPayment = ({ onSuccess, onFailed }: UseSePayPaymentProps) => {
  const handlePaymentSuccess = useCallback(() => {
    toast.success("Thanh toán thành công!");
    onSuccess();
  }, [onSuccess]);

  const handlePaymentFailed = useCallback(() => {
    toast.error("Thanh toán thất bại!");
    onFailed();
  }, [onFailed]);

  return {
    handlePaymentSuccess,
    handlePaymentFailed,
  };
};

export default useSePayPayment;
