import { TCreateUpdatePriceRatio } from "@/types/price-ratios";
import * as Yup from "yup";

export const validationDefectSchema = Yup.object({
  date: Yup.string().required("โปรดระบุวันที่"),
  time_slot: Yup.string().required("โปรดระบุช่วงเวลา"),
  process_id: Yup.string().required("โปรดระบุ Process"),
  defects_type: Yup.string().required("โปรดระบุประเภทของ NG").oneOf(["S", "P"]),
  part_id: Yup.string().required("โปรดระบุ Part"),
  case_id: Yup.string().required("โปรดระบุ สาเหตุของ NG"),
  ng_quantity: Yup.number().required("โปรดระบุจำนวน NG").min(1),
});

export const validationProductivitySchema = Yup.object({
  date: Yup.string().required("โปรดระบุวันที่"),
  time_slot: Yup.string().required("โปรดระบุช่วงเวลา"),
  process: Yup.string().required("โปรดระบุ Process"),
});

export const validationCauseSchema = Yup.object({
  case_name: Yup.string().required("โปรดระบุ Case Name"),
  processes: Yup.array().required("โปรดระบุ Processes").min(1),
});

export const validationPriceRatioSchema = Yup.object<TCreateUpdatePriceRatio>({
  effective_date: Yup.string().required("โปรดระบุวันที่"),
  ng_ratio: Yup.number().required("โปรดระบุ NG Ratio").min(0).max(100),
  scrap_ratio: Yup.number().required("โปรดระบุ Scrap Ratio").min(0).max(100),
  rework_ratio: Yup.number().required("โปรดระบุ Rework Ratio").min(0).max(100),
  remarks: Yup.string().notRequired(),
});
