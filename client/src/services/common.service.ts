import { API_BASE_URL } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TPlant, TResponse } from "@/types";
import { APIService } from "./api.service";

export class CommonService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getPlants = async (): Promise<TPlant[]> => {
    try {
      const { data } = await this.get<TResponse<TPlant[]>>(`/users/plants`);
      this.store.setPlantList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };
}
