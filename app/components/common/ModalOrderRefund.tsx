import { useAtom } from "jotai";
import ModalRefund from "~/components/common/ModalRefund";
import { IRefundRequest, orderService } from "~/services/api/order.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "~/components/common/Toast";
import { getErrorMessage } from "~/utils";
import { toggleLoading } from "~/components/common/ScreenLoading";

const ModalOrderRefund = ({
  visible,
  onClose,
  orderId,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  orderId: number;
  onSuccess: () => void;
}) => {
  const mutationRefund = useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: IRefundRequest;
    }) => orderService.refund(orderId.toString(), data),
  });

  return (
    <ModalRefund
      visible={visible}
      onClose={onClose}
      onSubmit={({ reason, images }) => {
        toggleLoading(true);
        mutationRefund.mutate(
          {
            orderId,
            data: {
              reason,
              images: images.map((image) => ({
                uri: image.uri,
                type: image.mimeType,
                name: image.name,
              })),
            },
          },
          {
            onSuccess: () => {
              toast.success("Yêu cầu hoàn trả hàng đã được gửi");
              onSuccess?.();
              onClose?.();
            },
            onError: (error) => {
              toast.error(
                getErrorMessage(error, "Lỗi khi gửi yêu cầu hoàn trả hàng")
              );
            },
            onSettled: () => {
              toggleLoading(false);
            },
          }
        );
      }}
    />
  );
};

export default ModalOrderRefund;
