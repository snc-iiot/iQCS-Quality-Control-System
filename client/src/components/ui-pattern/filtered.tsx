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

const handleModeChange = (
  selectValue: string,
  value: IFilteredProps["value"],
  onChange: IFilteredProps["onChange"]
) => {
  const { start_date } = value;

  switch (selectValue) {
    case "week": {
      const [year, week] = getWeekString(new Date(start_date)).split("-W");
      const YEAR = parseInt(year);
      const WEEK = parseInt(week);
      const { startDate, endDate } = getStartDateEndDateOfWeek(WEEK, YEAR);

      onChange({
        ...value,
        mode: selectValue as "week",
        start_date: renderFormattedPayloadDate(new Date(startDate)) ?? "",
        end_date: renderFormattedPayloadDate(new Date(endDate)) ?? "",
      });
      break;
    }
    case "period": {
      onChange({
        ...value,
        mode: selectValue as "period",
        end_date: start_date,
      });
      break;
    }
    default: {
      onChange({
        ...value,
        mode: selectValue as "daily" | "monthly",
      });
    }
  }
};

export const Filtered: FC<IFilteredProps> = ({ modeOptions, defectTypeOptions, value, onChange }) => {
  const { mode, defect_type, start_date, end_date } = value;

  const handleDateChange = (newStartDate: string, newEndDate: string = end_date) => {
    onChange({ ...value, start_date: newStartDate, end_date: newEndDate });
  };

  return (
    <div className="flex w-full flex-col items-start gap-2 md:w-max md:flex-row">
      {/* Defect Type Selection */}
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

      {/* Mode Selection */}
      <SelectForm
        options={modeOptions}
        className="w-full md:w-[10rem] lg:w-[10rem]"
        onChange={(e) => handleModeChange(e.target.value, value, onChange)}
        value={mode}
      />

      {/* Week Input */}
      {mode === "week" && (
        <DateInputForm
          onChange={(e) => {
            const [year, week] = e.target.value.split("-W");
            const YEAR = parseInt(year);
            const WEEK = parseInt(week);
            const { startDate, endDate } = getStartDateEndDateOfWeek(WEEK, YEAR);
            handleDateChange(
              renderFormattedPayloadDate(new Date(startDate)) ?? "",
              renderFormattedPayloadDate(new Date(endDate)) ?? ""
            );
          }}
          value={getWeekString(new Date(start_date))}
          className="block w-full md:w-[14rem] lg:w-[10rem]"
          type="week"
        />
      )}

      {/* Daily, Period, Monthly Date Input */}
      {(mode === "daily" || mode === "period" || mode === "monthly") && (
        <DateInputForm
          className="block w-full md:w-[14rem] lg:w-[10rem]"
          value={start_date.slice(0, mode === "monthly" ? 7 : 10)}
          onChange={(e) => {
            const newStartDate = e.target.value + (mode === "monthly" ? "-01" : "");
            let newEndDate = end_date;

            if (mode === "monthly") {
              const [year, month] = newStartDate.split("-");
              const endOfMonth = new Date(Number(year), Number(month), 0);
              newEndDate = `${year}-${month}-${endOfMonth.getDate()}`;
            }

            handleDateChange(newStartDate, newEndDate);
          }}
          type={mode === "monthly" ? "month" : "date"}
        />
      )}

      {/* End Date for Period Mode */}
      {mode === "period" && (
        <DateInputForm
          className="block w-full md:w-[14rem] lg:w-[10rem]"
          value={end_date}
          onChange={(e) => handleDateChange(start_date, e.target.value)}
          type="date"
          min={start_date}
        />
      )}
    </div>
  );
};
