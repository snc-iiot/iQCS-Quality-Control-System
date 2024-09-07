import { TValueProductionOptionFilter } from "@/components/history";
import { TMapDataProductivity } from "@/types";
import { groupByField } from "./array.helper";
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
  values: TValueProductionOptionFilter
): {
  start_date_time: string;
  end_date_time: string;
} => {
  let start_date_time = covertToUTC(values?.start_date);
  let end_date_time = covertToUTC(values?.end_date);
  const dateTime = {
    start: GET_TIME_SLOTS(values?.start_date)?.[0]?.date_time,
    end: GET_TIME_SLOTS(values?.start_date)?.[GET_TIME_SLOTS(values?.start_date)?.length - 1]?.date_time,
  };

  if (values?.mode == "daily") {
    start_date_time = dateTime.start;
    end_date_time = dateTime.end;
  } else {
    start_date_time = covertToUTC(values?.start_date);
    end_date_time = covertToUTC(values?.end_date);
  }

  return {
    start_date_time,
    end_date_time,
  };
};

export const DEFECT_HEADER = (values: TValueProductionOptionFilter) => {
  return [
    { label: "Part Name", key: "part_name" },
    ...(values.shift === "DAY"
      ? [
          { label: "08:00 - 09:00", key: "08:00 - 09:00" },
          { label: "09:00 - 10:00", key: "09:00 - 10:00" },
          { label: "10:00 - 11:00", key: "10:00 - 11:00" },
          { label: "11:00 - 12:00", key: "11:00 - 12:00" },
          { label: "12:00 - 13:00", key: "12:00 - 13:00" },
          { label: "13:00 - 14:00", key: "13:00 - 14:00" },
          { label: "14:00 - 15:00", key: "14:00 - 15:00" },
          { label: "15:00 - 16:00", key: "15:00 - 16:00" },
          { label: "16:00 - 17:00", key: "16:00 - 17:00" },
          { label: "17:00 - 18:00", key: "17:00 - 18:00" },
          { label: "18:00 - 19:00", key: "18:00 - 19:00" },
          { label: "19:00 - 20:00", key: "19:00 - 20:00" },
        ]
      : [
          { label: "20:00 - 21:00", key: "20:00 - 21:00" },
          { label: "21:00 - 22:00", key: "21:00 - 22:00" },
          { label: "22:00 - 23:00", key: "22:00 - 23:00" },
          { label: "23:00 - 24:00", key: "23:00 - 24:00" },
          { label: "24:00 - 01:00", key: "24:00 - 01:00" },
          { label: "01:00 - 02:00", key: "01:00 - 02:00" },
          { label: "02:00 - 03:00", key: "02:00 - 03:00" },
          { label: "03:00 - 04:00", key: "03:00 - 04:00" },
          { label: "04:00 - 05:00", key: "04:00 - 05:00" },
          { label: "05:00 - 06:00", key: "05:00 - 06:00" },
          { label: "06:00 - 07:00", key: "06:00 - 07:00" },
          { label: "07:00 - 08:00", key: "07:00 - 08:00" },
        ]),
  ]?.filter((header) => {
    if (values?.mode === "daily") {
      return header.key !== "date";
    }
    return true;
  });
};

export const MapDataProductivity = (
  values: TValueProductionOptionFilter,
  productivityMapped: {
    part_name: string;
    time_slot: string;
    process_id: string;
    quantity: string | number;
  }[]
) => {
  const groupPartName = Object.keys(
    groupByField(productivityMapped?.filter((info) => info?.process_id === values?.process_id), "part_name")
  );

  const req: TMapDataProductivity[] = [];

  for (let i = 0; i < groupPartName.length; i++) {
    const groupTimeSlot = groupByField(
      productivityMapped?.filter(
        (info) => info?.part_name === groupPartName[i] && info?.process_id === values?.process_id
      ),
      "time_slot"
    );
    const objectGroupTimeSlot = Object.keys(groupTimeSlot).filter(
      (item) =>
        (values?.shift === "DAY"
          ? [
              "08:00 - 09:00",
              "09:00 - 10:00",
              "10:00 - 11:00",
              "11:00 - 12:00",
              "12:00 - 13:00",
              "13:00 - 14:00",
              "14:00 - 15:00",
              "15:00 - 16:00",
              "16:00 - 17:00",
              "17:00 - 18:00",
              "18:00 - 19:00",
              "19:00 - 20:00",
            ]
          : [
              "20:00 - 21:00",
              "21:00 - 22:00",
              "22:00 - 23:00",
              "23:00 - 24:00",
              "24:00 - 01:00",
              "01:00 - 02:00",
              "02:00 - 03:00",
              "03:00 - 04:00",
              "04:00 - 05:00",
              "05:00 - 06:00",
              "06:00 - 07:00",
              "07:00 - 08:00",
            ]
        )?.includes(item)
    );

    req[i] = { ...req[i], part_name: groupPartName[i] } as TMapDataProductivity;

    for (let j = 0; j < objectGroupTimeSlot.length; j++) {
      const sumOfQuantities = groupTimeSlot[objectGroupTimeSlot[j]].reduce<number>((acc, curr) => {
        const quantity = Number(curr.quantity ?? 0);
        return acc + quantity;
      }, 0);

      req[i] = { ...req[i], [objectGroupTimeSlot[j]]: sumOfQuantities } as TMapDataProductivity;
    }
  }

  return req?.filter((info) => Object.keys(info)?.length > 1);
};
