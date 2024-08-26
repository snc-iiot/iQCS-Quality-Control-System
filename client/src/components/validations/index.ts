import * as Yup from "yup";

export const validationDefectSchema = Yup.object({
  date: Yup.string().required("โปรดระบุวันที่"),
  time_slot: Yup.string().required("โปรดระบุช่วงเวลา"),
  process: Yup.string().required("โปรดระบุ Process"),
  part_code: Yup.string().required("โปรดระบุ Part Code"),
  ng_id: Yup.string().required("โปรดระบุ สาเหตุของ NG"),
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
