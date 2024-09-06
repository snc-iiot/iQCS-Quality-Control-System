import { ProcessSelection, SNCOverviewData, TGraphSummary } from "@/types";
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

// Utility function to map composition data
/**
 * The `mapCompositionData` function takes overview data, plant code, process selections, and an
 * optional flag to show part ID, and returns an array of objects with specific properties based on the
 * provided data.
 * @param {SNCOverviewData[]} overviewData - The `overviewData` parameter is an array of objects of
 * type `SNCOverviewData`. It contains data related to the overview of a manufacturing process in a
 * specific plant.
 * @param {string} plantCode - The `plantCode` parameter in the `mapCompositionData` function is a
 * string that represents the code of a specific plant. It is used to filter and retrieve data related
 * to a particular plant from the `overviewData`.
 * @param {ProcessSelection[]} processSelections - The `processSelections` parameter is an array of
 * objects containing information about the selected processes. Each object has the following
 * properties:
 * @param [showPartId=false] - The `showPartId` parameter in the `mapCompositionData` function is a
 * boolean flag that determines whether to include the `part_id` in the output data. If `showPartId` is
 * set to `true`, the `part_id` will be included in the output data along with
 * @returns The function `mapCompositionData` returns an array of objects with the following
 * properties: `label` (string), `part_id` (optional string), `production` (number), `ng` (number), and
 * `percentage` (number).
 */
export const mapCompositionData = (
  overviewData: SNCOverviewData[],
  plantCode: string,
  processSelections: ProcessSelection[],
  showPartId = false
): { label: string; part_id?: string; production: number; ng: number; percentage: number }[] => {
  const processId = processSelections.find((p) => p.plant_code === plantCode)?.process_id;
  const processData = overviewData
    .find((item) => item.plant_code === plantCode)
    ?.process.find((item) => item.process_id === processId)?.data;

  const parseNumber = (value: number) => (isNaN(Number(value)) ? 0 : value);

  return (
    processData?.map((item) => ({
      label: item.part_name,
      part_id: showPartId ? item.part_id : undefined,
      production: parseNumber(item.production_quantity || 0),
      ng: parseNumber(item.ng_quantity || 0),
      percentage: Number(parseNumber(item.defects_percentage || 0).toFixed(2)),
    })) ?? []
  );
};
