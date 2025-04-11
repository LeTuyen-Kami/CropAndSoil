import { typedAxios } from "../base";

export interface IProvince {
  id: string;
  name: string;
  type: string;
  slug: string;
}

export interface IDistrict {
  id: string;
  name: string;
  type: string;
  provinceId: string;
}

export interface IWard {
  id: string;
  name: string;
  type: string;
  districtId: string;
}

class PlaceService {
  async getProvinces() {
    return typedAxios.get<IProvince[]>("/provinces");
  }

  async getDistricts(provinceId: string) {
    return typedAxios.get<IDistrict[]>(`/districts?provinceId=${provinceId}`);
  }

  async getWards(districtId: string) {
    return typedAxios.get<IWard[]>(`/wards?districtId=${districtId}`);
  }
}

export const placeService = new PlaceService();
