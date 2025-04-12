import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  IDistrict,
  IProvince,
  IWard,
  placeService,
} from "~/services/api/place.service";

type AddressOption = {
  id: string;
  name: string;
  code: string;
};

const useAddress = ({ enabled = true }: { enabled?: boolean }) => {
  const [selectedProvince, setSelectedProvince] =
    useState<AddressOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] =
    useState<AddressOption | null>(null);
  const [selectedWard, setSelectedWard] = useState<AddressOption | null>(null);

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: placeService.getProvinces,
    enabled: enabled,
  });

  const { data: districts } = useQuery({
    queryKey: ["districts", selectedProvince?.id],
    queryFn: () => placeService.getDistricts(selectedProvince?.id || ""),
    enabled: !!selectedProvince?.id,
  });

  const { data: wards } = useQuery({
    queryKey: ["wards", selectedDistrict?.id],
    queryFn: () => placeService.getWards(selectedDistrict?.id || ""),
    enabled: !!selectedDistrict?.id,
  });

  const handleSelectProvince = (province: AddressOption) => {
    setSelectedProvince(province);
  };

  const handleSelectDistrict = (district: AddressOption) => {
    setSelectedDistrict(district);
  };

  const handleSelectWard = (ward: AddressOption) => {
    setSelectedWard(ward);
  };

  const handleResetProvince = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
  };

  const handleResetDistrict = () => {
    setSelectedDistrict(null);
    setSelectedWard(null);
  };

  const handleResetWard = () => {
    setSelectedWard(null);
  };

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectWard,
    handleResetProvince,
    handleResetDistrict,
    handleResetWard,
  };
};
export default useAddress;
