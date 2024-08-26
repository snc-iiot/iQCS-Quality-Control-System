import { TGraphSummary } from "@/types";
import { groupByField } from "./array.helper";
import { renderFormattedPayloadDate } from "./date-time.helper";

type GroupedItems<T> = { [key: string]: T[] };

export const useDashboardHelper = (data: TGraphSummary[]) => {
  const groupProcess = (field: keyof TGraphSummary): GroupedItems<TGraphSummary> => {
    if (!data) return {};
    return groupByField(data, field);
  };

  const groupDate = (dates: string[]): GroupedItems<TGraphSummary> => {
    if (!data) return {};

    const result = dates.reduce<{ [key: string]: any[] }>((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    for (const date of dates) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      const nextDate = renderFormattedPayloadDate(newDate);

      const dataDate = data?.filter(
        (info) =>
          (info?.time_slot !== "07:00 - 08:00" && info?.date === date) ||
          (info?.time_slot === "07:00 - 08:00" && info?.date === nextDate)
      );

      result[date] = dataDate;
    }

    return result;
  };

  // date: "2024-08-13";
  // datetime: "2024-08-13T01:00:00.000Z";
  // ng_quantity: 0;
  // process: "CUTTING";
  // shift: "DAY";
  // time_slot: "08:00 - 09:00";

  return {
    groupProcess,
    groupDate,
  };
};
