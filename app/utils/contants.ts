export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export const GENDER_TYPE = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export const GENDER_OPTIONS = [
  { label: "Nam", value: GENDER_TYPE.MALE },
  { label: "Nữ", value: GENDER_TYPE.FEMALE },
  { label: "Khác", value: GENDER_TYPE.OTHER },
];

export const ADDRESS_TYPE = {
  OFFICE: "company",
  HOME: "home",
};

export const ADDRESS_TYPE_OPTIONS = [
  { label: "Văn phòng", value: ADDRESS_TYPE.OFFICE },
  { label: "Nhà riêng", value: ADDRESS_TYPE.HOME },
];

export const BREAKPOINTS = {
  0: 2, // Mặc định 2 item
  600: 3, // ≥600px thì 3 item
  900: 4, // ≥900px thì 4 item
  1200: 5, // ≥1200px thì 5 item
};
export const ORDER_STATUS = {
  PENDING: "wc-pending",
  PROCESSING: "wc-processing",
  SHIPPED: "wc-transport",
  DELIVERED: "wc-delivered",
  RETURNED: "wc-refunded",
  CANCELLED: "wc-cancelled",
};

export const ORDER_STATUS_COLOR = {
  [ORDER_STATUS.PENDING]: "#FF9800", // Orange for pending
  [ORDER_STATUS.PROCESSING]: "#2196F3", // Blue for processing
  [ORDER_STATUS.SHIPPED]: "#9C27B0", // Purple for shipped
  [ORDER_STATUS.DELIVERED]: "#4CAF50", // Green for delivered
  [ORDER_STATUS.RETURNED]: "#F44336", // Red for returned
  [ORDER_STATUS.CANCELLED]: "#9E9E9E", // Grey for cancelled
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: "Chờ xác nhận",
  [ORDER_STATUS.PROCESSING]: "Chờ vận chuyển",
  [ORDER_STATUS.SHIPPED]: "Đang vận chuyển",
  [ORDER_STATUS.DELIVERED]: "Đã giao",
  [ORDER_STATUS.RETURNED]: "Đã trả hàng",
};
