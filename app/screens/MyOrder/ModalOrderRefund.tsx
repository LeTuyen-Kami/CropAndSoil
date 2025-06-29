import { useAtom } from "jotai";
import ModalOrderRefund from "~/components/common/ModalOrderRefund";
import { modalRefundAtom } from "./atoms";

const ModalOrderRefundWithAtom = () => {
  const [modalRefund, setModalRefund] = useAtom(modalRefundAtom);
  return (
    <ModalOrderRefund
      visible={modalRefund.visible}
      onClose={() =>
        setModalRefund({ visible: false, orderId: null, onSuccess: () => {} })
      }
      orderId={modalRefund.orderId!}
      onSuccess={modalRefund.onSuccess}
    />
  );
};

export default ModalOrderRefundWithAtom;
