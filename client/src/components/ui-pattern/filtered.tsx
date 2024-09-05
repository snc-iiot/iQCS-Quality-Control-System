import { getStartDateEndDateOfWeek, getWeekString, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { FC, ReactNode } from "react";
import { DateInputForm } from "./form-field";
import { SelectForm } from "./form-field/select-form";

type TOption = {
  label: string | ReactNode;
  value: string;
};

interface IFilteredProps {
  modeOptions: TOption[];
  defectTypeOptions: TOption[];
  value: {
    mode: "daily" | "period" | "week" | "monthly";
    defect_type: "ALL" | "P" | "S";
    start_date: string;
    end_date: string;
  };
  onChange: (value: {
    mode: "daily" | "period" | "week" | "monthly";
    defect_type: "ALL" | "P" | "S";
    start_date: string;
    end_date: string;
  }) => void;
}

export const Filtered: FC<IFilteredProps> = ({ modeOptions, defectTypeOptions, value, onChange }) => {
  const { mode, defect_type, start_date, end_date } = value;

  return (
    <div className="flex items-center gap-2">
      <SelectForm
        options={defectTypeOptions}
        className="w-full md:w-[10rem] lg:w-[10rem]"
        onChange={(e) =>
          onChange({
            ...value,
            defect_type: e.target.value as "ALL" | "P" | "S",
          })
        }
        value={defect_type}
      />
      <SelectForm
        options={modeOptions}
        className="w-full md:w-[10rem] lg:w-[10rem]"
        onChange={(e) => onChange({ ...value, mode: e.target.value as "daily" | "period" | "week" | "monthly" })}
        value={mode}
      />
      {mode === "week" && (
        <DateInputForm
          onChange={(e) => {
            const dateValue = e.target.value;
            const [year, week] = dateValue.split("-W");
            const YEAR = parseInt(year);
            const WEEK = parseInt(week);
            const { startDate: start_date, endDate: end_date } = getStartDateEndDateOfWeek(WEEK, YEAR);
            onChange({
              ...value,
              start_date: renderFormattedPayloadDate(new Date(start_date)) ?? "",
              end_date: renderFormattedPayloadDate(new Date(end_date)) ?? "",
            });
          }}
          value={getWeekString(new Date(start_date))}
          className="block w-full md:w-[14rem] lg:w-[10rem]"
          type="week"
        />
      )}
      {(mode === "daily" || mode === "period" || mode === "monthly") && (
        <DateInputForm
          className="block w-full md:w-[14rem] lg:w-[10rem]"
          value={start_date?.slice(0, mode === "monthly" ? 7 : 10)}
          onChange={(e) => {
            const start_date = e.target.value + (mode === "monthly" ? "-01" : "");
            let new_end_date = end_date;
            if (mode === "monthly") {
              const [year, month] = start_date.split("-");
              const endOfMonth = new Date(Number(year), Number(month), 0);
              new_end_date = `${year}-${month}-${endOfMonth.getDate()}`;
            }
            onChange({
              ...value,
              start_date,
              end_date,
            });
          }}
          type={mode === "monthly" ? "month" : "date"}
        />
      )}
      {mode === "period" && (
        <DateInputForm
          className="block w-full md:w-[14rem] lg:w-[10rem]"
          value={end_date}
          onChange={(e) => onChange({ ...value, end_date: e.target.value })}
          type="date"
          min={start_date}
        />
      )}
    </div>
  );
};
