import { TCreateCostConfig } from "@/types/config-cost";
import { FC } from "react";

interface ICreateUpdateCostProps {
  data: Partial<TCreateCostConfig>;
  onClose?: () => void;
}

export const CreateUpdateCost: FC<ICreateUpdateCostProps> = (props) => {
  return <div></div>;
};
