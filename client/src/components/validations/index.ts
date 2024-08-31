import { TCreateUpdatePriceRatio } from "@/types/price-ratios";
import * as Yup from "yup";

// Common validation schemas
const requiredString = (message: string) => Yup.string().required(message);
const requiredNumber = (message: string) => Yup.number().required(message).min(1);
const requiredPercentage = (message: string) => Yup.number().required(message).min(0).max(100);

// Validation schemas
export const validationDefectSchema = Yup.object({
  date: requiredString("โปรดระบุวันที่"),
  time_slot: requiredString("โปรดระบุช่วงเวลา"),
  process_id: requiredString("โปรดระบุ Process"),
  defects_type: requiredString("โปรดระบุประเภทของ NG").oneOf(["S", "P"]),
  part_id: requiredString("โปรดระบุ Part"),
  case_id: requiredString("โปรดระบุ สาเหตุของ NG"),
  ng_quantity: requiredNumber("โปรดระบุจำนวน NG"),
});

export const validationProductivitySchema = Yup.object({
  date: requiredString("โปรดระบุวันที่"),
  time_slot: requiredString("โปรดระบุช่วงเวลา"),
  process: requiredString("โปรดระบุ Process"),
});

export const validationCauseSchema = Yup.object({
  case_name: requiredString("โปรดระบุ Case Name"),
  processes: Yup.array().required("โปรดระบุ Processes").min(1),
});

export const validationPriceRatioSchema = Yup.object<TCreateUpdatePriceRatio>({
  effective_date: requiredString("โปรดระบุวันที่"),
  ng_ratio: requiredPercentage("โปรดระบุ NG Ratio"),
  scrap_ratio: requiredPercentage("โปรดระบุ Scrap Ratio"),
  rework_ratio: requiredPercentage("โปรดระบุ Rework Ratio"),
  remarks: Yup.string().notRequired(),
});
