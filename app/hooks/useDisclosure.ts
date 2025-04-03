import { useState } from "react";

const useDisclosure = ({
  initialOpenValue,
}: { initialOpenValue?: any } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openValue, setOpenValue] = useState(initialOpenValue);

  const onOpen = (value?: any) => {
    setIsOpen(true);
    setOpenValue(value);
  };

  const onClose = () => {
    setIsOpen(false);
    setOpenValue({});
  };

  return { isOpen, openValue, setOpenValue, onOpen, onClose };
};

export default useDisclosure;
