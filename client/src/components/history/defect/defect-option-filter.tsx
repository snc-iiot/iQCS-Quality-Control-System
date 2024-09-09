import { DateInputForm } from "@/components/ui-pattern";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GET_TIME_SLOTS } from "@/helpers";
import { getStartDateEndDateOfWeek, getWeekString, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { useAtomStore } from "@/store";
import { formatDate } from "date-fns";
import { FC } from "react";

export type TValue = {
  mode: "daily" | "period" | "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  time_slot: string;
};

type TFilterMapped = {
  shift: string[];
  process_id: string[];
};

interface DefectOptionFilterProps {
  values: TValue;
  setValues: React.Dispatch<React.SetStateAction<TValue>>;
  filterMapped: TFilterMapped;
  setFilterMapped: React.Dispatch<React.SetStateAction<TFilterMapped>>;
  onExport?: () => void;
}

export const DefectOptionFilter: FC<DefectOptionFilterProps> = ({
  values,
  setValues,
  filterMapped,
  setFilterMapped,
  onExport,
}) => {
  const { processList } = useAtomStore();

  const handleDateChange = (key: "start_date" | "end_date") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = renderFormattedPayloadDate(e.target.value) ?? "";
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as TValue["mode"];
    let start_date = renderFormattedPayloadDate(new Date()) ?? "";
    let end_date = renderFormattedPayloadDate(new Date()) ?? "";

    if (mode === "weekly") {
      const currentWeek = getWeekString(new Date());
      const { startDate, endDate } = getStartDateEndDateOfWeek(
        parseInt(currentWeek.split("-W")[1]),
        parseInt(currentWeek.split("-W")[0])
      );
      start_date = renderFormattedPayloadDate(startDate) ?? "";
      end_date = renderFormattedPayloadDate(endDate) ?? "";
    } else if (mode === "monthly") {
      start_date = renderFormattedPayloadDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) ?? "";
      end_date = renderFormattedPayloadDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)) ?? "";
    } else if (mode === "yearly") {
      start_date = renderFormattedPayloadDate(new Date(new Date().getFullYear(), 0, 1)) ?? "";
      end_date = renderFormattedPayloadDate(new Date(new Date().getFullYear(), 11, 31)) ?? "";
    }

    setValues((prev) => ({ ...prev, mode, start_date, end_date }));
  };

  const handleCheckboxChange = (key: keyof TFilterMapped, id: string) => (checked: boolean) => {
    setFilterMapped((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], id] : prev[key].filter((item) => item !== id),
    }));
  };

  const renderInputByMode = () => {
    switch (values.mode) {
      case "daily":
        return <DateInputForm value={values.start_date} onChange={handleDateChange("start_date")} type="date" />;
      case "period":
        return (
          <>
            <DateInputForm
              value={values.start_date}
              onChange={handleDateChange("start_date")}
              type="date"
              max={values.end_date}
            />
            <DateInputForm
              value={values.end_date}
              onChange={handleDateChange("end_date")}
              type="date"
              min={values.start_date}
            />
          </>
        );
      case "weekly":
        return (
          <DateInputForm
            type="week"
            onChange={(e) => {
              const [year, week] = e.target.value.split("-W");
              const { startDate, endDate } = getStartDateEndDateOfWeek(parseInt(week), parseInt(year));
              setValues((prev) => ({
                ...prev,
                start_date: renderFormattedPayloadDate(startDate) ?? "",
                end_date: renderFormattedPayloadDate(endDate) ?? "",
              }));
            }}
            value={getWeekString(new Date(values.start_date)) ?? ""}
          />
        );
      case "monthly":
        return (
          <DateInputForm
            type="month"
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              const start_date = new Date(parseInt(year), parseInt(month) - 1, 1);
              const end_date = new Date(parseInt(year), parseInt(month), 0);
              setValues((prev) => ({
                ...prev,
                start_date: renderFormattedPayloadDate(start_date) ?? "",
                end_date: renderFormattedPayloadDate(end_date) ?? "",
              }));
            }}
            value={formatDate(new Date(values.start_date), "yyyy-MM") ?? ""}
          />
        );
      case "yearly":
        return (
          <SelectForm
            options={Array.from({ length: new Date().getFullYear() - 2019 + 1 }, (_, i) => {
              const year = 2019 + i;
              return { label: year.toString(), value: year.toString() };
            })}
            value={new Date(values.start_date).getFullYear().toString()}
            onChange={(e) => {
              const year = parseInt(e.target.value);
              const start_date = new Date(year, 0, 1);
              const end_date = new Date(year, 11, 31);
              setValues((prev) => ({
                ...prev,
                start_date: renderFormattedPayloadDate(start_date) ?? "",
                end_date: renderFormattedPayloadDate(end_date) ?? "",
              }));
            }}
            className="w-full md:w-[5rem]"
          />
        );
    }
  };

  const renderFilterSection = (
    key: keyof TFilterMapped,
    label: string,
    items: { label: string; value: string }[],
    ids: string[]
  ) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <button
          onClick={() => setFilterMapped((prev) => ({ ...prev, [key]: [] }))}
          className="text-xs text-red-500 hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col">
        {items?.map((item, index) => (
          <div className="flex items-center gap-2" key={index}>
            <Checkbox
              id={item.value}
              name={item.label}
              checked={ids.includes(item.value)}
              onCheckedChange={handleCheckboxChange(key, item.value)}
            />
            <label htmlFor={item.value} className="text-sm">
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SelectForm
        options={[
          { label: "รายวัน / Daily", value: "daily" },
          { label: "ช่วงวัน / Period", value: "period" },
          { label: "สัปดาห์ / Week", value: "weekly" },
          { label: "รายเดือน / Monthly", value: "monthly" },
          { label: "รายปี / Yearly", value: "yearly" },
        ]}
        className="w-full md:w-[14rem]"
        value={values.mode}
        onChange={handleModeChange}
      />
      {renderInputByMode()}
      {values.mode === "daily" && (
        <SelectForm
          options={GET_TIME_SLOTS(values.start_date, true)}
          value={values.time_slot}
          onChange={(e) => setValues((prev) => ({ ...prev, time_slot: e.target.value }))}
          className="w-full md:w-[14rem]"
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-max">
            {`${Object.values(filterMapped).reduce((acc, curr) => acc + curr.length, 0) == 0 ? "Filter" : "Filtering"}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="space-y-1">
          {renderFilterSection(
            "process_id",
            "Filter by Process",
            processList?.map((p) => ({ label: p.process_name, value: p.process_id })) ?? [],
            filterMapped.process_id
          )}
          {renderFilterSection(
            "shift",
            "Filter by Shift",
            [
              {
                label: "Day",
                value: "DAY",
              },
              {
                label: "Night",
                value: "NIGHT",
              },
            ],
            filterMapped.shift
          )}
        </PopoverContent>
      </Popover>
      <Button onClick={onExport}>Export Excel</Button>
    </div>
  );
};
