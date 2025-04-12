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
