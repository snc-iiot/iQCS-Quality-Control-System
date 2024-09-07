import { TValue } from "@/components/history";
import { TDefect } from "@/types";
import { GET_TIME_SLOTS } from "./time-slot";

const covertToUTC = (date: string | null | undefined): string => {
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString();
    } else {
      return "";
    }
  }
  return "";
};

export const getRequiredRawDefects = (
  values: TValue
): {
  start_date_time: string;
  end_date_time: string;
} => {
  const dateTime =
    values?.time_slot === "08:00 - 08:00"
      ? {
          start: GET_TIME_SLOTS(values?.start_date)?.[0]?.date_time,
          end: GET_TIME_SLOTS(values?.start_date)?.[GET_TIME_SLOTS(values?.start_date)?.length - 1]?.date_time,
        }
      : {
          start: GET_TIME_SLOTS(values?.start_date)?.find((slot) => slot.value === values?.time_slot)?.date_time || "",
          end: GET_TIME_SLOTS(values?.start_date)?.find((slot) => slot.value === values?.time_slot)?.date_time || "",
        };

  //work time 08:00 - 07:59 (next day)
  // example: getDateTime("2021-09-01", "2021-09-01") ==> {start: "2021-09-01T08:00:00.000Z", end: "2021-09-02T07:59:00.000Z"}
  const getDateTime = (start_date: string, end_date: string) => {
    const start = new Date(start_date);
    const endNextDay = new Date(end_date);

    start.setHours(8, 0, 0, 0); // Set start time to 08:00
    endNextDay.setDate(endNextDay.getDate() + 1); // Move to the next day
    endNextDay.setHours(7, 59, 0, 0); // Set end time to 07:59

    return {
      start: start.toISOString(),
      end: endNextDay.toISOString(),
    };
  };

  const mode: {
    [key in TValue["mode"]]: {
      start: string;
      end: string;
    };
  } = {
    daily: {
      start: dateTime.start,
      end: dateTime.end,
    },
    monthly: {
      start: covertToUTC(values?.start_date),
      end: covertToUTC(values?.end_date),
    },
    weekly: {
      start: covertToUTC(values?.start_date),
      end: covertToUTC(values?.end_date),
    },
    period: {
      start: getDateTime(values?.start_date, values?.end_date).start,
      end: getDateTime(values?.start_date, values?.end_date).end,
    },
  };

  return {
    start_date_time: mode[values?.mode].start,
    end_date_time: mode[values?.mode].end,
  };
};

export const DEFECT_HEADER = (values: TValue) => {
  return [
    { label: "Date", key: "date" },
    { label: "Time", key: "time_slot" },
    {
      label: "Shift",
      key: "shift",
    },
    { label: "Process", key: "process_id" },
    { label: "Machine Name", key: "machine_id" },
    {
      label: "Operator Name",
      key: "operator_name",
    },
    { label: "Part Code", key: "part_code" },
    { label: "Part Name", key: "part_name" },
    { label: "Production Quantity", key: "production_quantity" },
    { label: "Ng Quantity", key: "ng_quantity" },
    { label: "Rework Quantity", key: "rework_quantity" },
    { label: "Scrap Quantity", key: "scrap_quantity" },
    {
      label: "Rework Cost Per Unit (USD)",
      key: "rework_cost_per_unit",
    },
    {
      label: "Scrap Cost Per Unit (USD)",
      key: "scrap_cost_per_unit",
    },
    { label: "Case Name", key: "case_name" },
    { label: "NG Description", key: "ng_description" },
    { label: "Remarks", key: "remarks" },
    { label: "Inspector Name", key: "inspector_name" },
    { label: "Created At", key: "created_at" },
    { label: "Updated At", key: "updated_at" },
    { label: "Action", key: "action" },
  ]?.filter((header) => {
    if (values?.mode === "daily") {
      return header.key !== "date";
    }
    return true;
  });
};

export const summaryMapped = (key: keyof TDefect, defectMapped: TDefect[] | undefined): number => {
  return (
    defectMapped?.reduce((acc, curr) => {
      const value = curr[key];
      const numericValue = typeof value === "number" ? value : 0;
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0) ?? 0
  );
};
