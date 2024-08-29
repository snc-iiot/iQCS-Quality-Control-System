import { GET_PLANTS } from "@/lib/constants";
import { TPlant } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CommonService } from "../common.service";

export const useCommon = () => {
  const { getPlants } = new CommonService();

  const useGetPlants = () => {
    return useQuery({
      queryKey: [GET_PLANTS],
      queryFn: (): Promise<TPlant[]> => getPlants(),
      refetchInterval: 10000,
    });
  };

  return {
    useGetPlants,
  };
};
