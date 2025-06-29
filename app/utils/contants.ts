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
  PENDING:
    "wc-pending,wc-processing,wc-on-hold,wc-checkout-draft,wc-error-send-shipping,wc-payment-pending,wc-payment-fail",
  PROCESSING: "wc-wait-pickup,wc-failed-pickup,wc-payment-success",
  SHIPPED: "wc-transport,wc-failed-delivery",
  DELIVERED: "wc-completed,wc-delivered",
  RETURNED: "wc-refunded,wc-claim-refund",
  CANCELLED: "wc-cancelled,wc-failed,wc-failed-pickup,wc-failed-delivery",
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
  [ORDER_STATUS.RETURNED]: "Đổi trả",
  [ORDER_STATUS.CANCELLED]: "Hủy đơn",
};

export const ERROR_CODE = {
  SUCCESS: "success",
  INVALID_REQUEST_HEADER: "invalid_request_header",
  INVALID_OTP: "invalid_otp",
  INVALID_OTP_TRANSACTION: "invalid_otp_transaction",
  PHONE_ALREADY_EXIST: "phone_already_exist",
  EMAIL_ALREADY_EXIST: "email_already_exist",
  PHONE_NOT_EXIST: "phone_not_exist",
  ACCOUNT_NOT_EXIST: "account_not_exist",
  REGISTER_FAILED: "register_failed",
  NOT_FOUND_PRODUCT: "not_found_product",
  NOT_FOUND_VARIATION: "not_found_variation",
  NOT_FOUND_VOUCHER: "not_found_voucher",
  NOT_FOUND_SHOP: "not_found_shop",
  NOT_FOUND_ORDER: "not_found_order",
  NOT_FOUND_ADDRESS: "not_found_address",
  NOT_FOUND_CART_ITEM: "not_found_cart_item",
  NOT_FOUND_NOTIFICATION: "not_found_notification",
  NOT_FOUND_REVIEW: "not_found_review",
  ALREADY_CANCELLED_ORDER: "already_cancelled_order",
  UNAVAILABLE_ORDER_TRACKING: "unavailable_order_tracking",
  ERROR_ORDER_TRACKING: "error_order_tracking",
  UNAUTHORIZED: "unauthorized",
  AUTHENTICATION_FAILED: "authentication_failed",
  EXPIRED_SESSION: "expired_session",
  NO_ITEM_IN_SHOP_CART: "no_item_in_shop_cart",
  MINIMUM_AMOUNT_APPLYING_VOUCHER: "minimum_amount_applying_voucher",
  INVALID_PAYMENT_METHOD: "invalid_payment_method",
  INVALID_SHIPPING_METHOD: "invalid_shipping_method",
  CHECKOUT_ORDER_FAIL: "checkout_order_fail",
  ERROR_SHIPMENT_FEE: "error_shipment_fee",
  ERROR_SMS_SERVICE: "error_sms_service",
  ERROR_INVALID_PHONE_NUMBER: "error_invalid_phone_number",
  LOCKED_ACCOUNT: "locked_account",
  PAYMENT_GATEWAY_ERROR: "payment_gateway_error",
  COMMENT_ALREADY_EXIST: "comment_already_exist",
  FORBIDDEN_REVIEW: "forbidden_review",
  TOO_MANY_REQUEST: "too_many_request",
};

export const INVALID_ACCOUNT_MESSAGE =
  "Tài khoản của bạn chưa được kích hoạt.\nVui lòng bổ sung thông tin doanh nghiệp để kích hoạt và mua hàng.";
