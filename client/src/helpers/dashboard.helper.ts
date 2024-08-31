import { TGraphSummary } from "@/types";
import { groupByField } from "./array.helper";
import { renderFormattedPayloadDate } from "./date-time.helper";

type GroupedItems<T> = Record<string, T[]>;

export const useDashboardHelper = (data: TGraphSummary[]) => {
  const groupProcess = (field: keyof TGraphSummary): GroupedItems<TGraphSummary> => {
    return data ? groupByField(data, field) : {};
  };

  const groupDate = (dates: string[]): GroupedItems<TGraphSummary> => {
    if (!data) return {};

    return dates.reduce<GroupedItems<TGraphSummary>>((acc, date) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      const nextDate = renderFormattedPayloadDate(newDate);

      const filteredData = data.filter(
        (info) =>
          (info.time_slot !== "07:00 - 08:00" && info.date === date) ||
          (info.time_slot === "07:00 - 08:00" && info.date === nextDate)
      );

      acc[date] = filteredData;
      return acc;
    }, {});
  };

  return {
    groupProcess,
    groupDate,
  };
};
