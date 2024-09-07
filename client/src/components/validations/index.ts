import { TCreateUpdateDefectMultiple } from "@/types";
import { TCreateUpdatePriceRatio } from "@/types/price-ratios";
import * as Yup from "yup";
import { TCreateUpdatePartPrice } from "./../../types/part";

export const validationDefectSchema = Yup.object({
  date: Yup.string().required("โปรดระบุวันที่"),
  time_slot: Yup.string().required("โปรดระบุช่วงเวลา"),
  process_id: Yup.string().required("โปรดระบุ Process"),
  defects_type: Yup.string().required("โปรดระบุประเภทของ NG").oneOf(["S", "P"]),
  part_id: Yup.string().required("โปรดระบุ Part"),
  case_id: Yup.string().required("โปรดระบุ สาเหตุของ NG"),
  ng_quantity: Yup.number().required("โปรดระบุจำนวน NG").min(0),
  production_quantity: Yup.number().required("โปรดระบุจำนวนผลิต").min(1),
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

export const validationImportExcelPartSchema = Yup.object({
  process_id: Yup.string().required("โปรดระบุ Process"),
  customer: Yup.string().required("โปรดระบุ Customer"),
  total_part: Yup.number().required("โปรดระบุ Total Part").min(1),
});

export const validationUpdatePartPriceSchema = Yup.object<TCreateUpdatePartPrice>({
  effective_date: Yup.string().required("โปรดระบุวันที่"),
  part_id: Yup.string().required("โปรดระบุ Part"),
  price: Yup.number().required("โปรดระบุราคา").min(0),
  remarks: Yup.string().notRequired(),
});

export const validationDefectMultipleSchema = Yup.object<TCreateUpdateDefectMultiple>({
  date: Yup.string().required("โปรดระบุวันที่"),
  time_slot: Yup.string().required("โปรดระบุช่วงเวลา"),
  defects_type: Yup.string().required("โปรดระบุประเภทของ NG").oneOf(["S", "P"]),
  process_id: Yup.string().required("โปรดระบุ Process"),
  part_id: Yup.string().required("โปรดระบุ Part"),
  defects: Yup.array()
    .of(
      Yup.object({
        case_id: Yup.string().required("โปรดระบุ สาเหตุของ NG"),
        ng_quantity: Yup.number().required("โปรดระบุจำนวน NG").min(0),
      })
    )
    .min(1),
  machine_id: Yup.string().notRequired(),
  operator_id: Yup.string().notRequired(),
  production_quantity: Yup.number().required("โปรดระบุจำนวนผลิต").min(1),
  rework_quantity: Yup.number().notRequired(),
  scrap_quantity: Yup.number().notRequired(),
  claim_supplier_quantity: Yup.number().notRequired(),
  scrap_approval_sheet_no: Yup.string().notRequired(),
  car_no: Yup.string().notRequired(),
  image: Yup.string().notRequired(),
  solve_problem: Yup.string().notRequired(),
  remarks: Yup.string().notRequired(),
});

export const validationCaseMultipleSchema = Yup.object({
  defects: Yup.array()
    .of(
      Yup.object({
        case_id: Yup.string().required("โปรดระบุ สาเหตุของ NG"),
        ng_quantity: Yup.number().required("โปรดระบุจำนวน NG").min(0),
      })
    )
    .min(1),
});
