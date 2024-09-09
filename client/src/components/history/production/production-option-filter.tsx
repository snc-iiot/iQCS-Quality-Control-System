import { DateInputForm } from "@/components/ui-pattern";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { Button } from "@/components/ui/button";
import {
  getStartDateEndDateOfWeek,
  getWeekString,
  optionsYearly,
  renderFormattedPayloadDate,
} from "@/helpers/date-time.helper";
import { useAtomStore } from "@/store";
import { formatDate } from "date-fns";
import { FC } from "react";

export type TValueProductionOptionFilter = {
  mode: "daily" | "period" | "weekly" | "monthly" | "yearly";
  shift: "DAY" | "NIGHT";
  process_id: string;
  start_date: string;
  end_date: string;
  filters: {
    process_id: string[];
    shift: string[];
  };
};

interface ProductionOptionFilterProps {
  values: TValueProductionOptionFilter;
  setValues: React.Dispatch<React.SetStateAction<TValueProductionOptionFilter>>;
  Export?: () => void;
}

export const ProductionOptionFilter: FC<ProductionOptionFilterProps> = ({ values, setValues, Export }) => {
  const { processList } = useAtomStore();

  const inputDate: {
    [key in TValueProductionOptionFilter["mode"]]: JSX.Element;
  } = {
    daily: (
      <DateInputForm
        value={values?.start_date}
        onChange={(e) =>
          setValues((prev) => ({
            ...prev,
            start_date: renderFormattedPayloadDate(e.target.value) ?? "",
            end_date: renderFormattedPayloadDate(e.target.value) ?? "",
          }))
        }
        type="date"
      />
    ),
    period: (
      <>
        <DateInputForm
          value={values?.start_date}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, start_date: renderFormattedPayloadDate(e.target.value) ?? "" }))
          }
          type="date"
          max={values?.end_date}
        />
        <DateInputForm
          value={values?.end_date}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, end_date: renderFormattedPayloadDate(e.target.value) ?? "" }))
          }
          min={values?.start_date}
          type="date"
        />
      </>
    ),
    weekly: (
      <DateInputForm
        type="week"
        onChange={(e) => {
          const value = e.target.value;
          const [year, week] = value.split("-W");
          const YEAR = parseInt(year);
          const WEEK = parseInt(week);
          const { startDate: start_date, endDate: end_date } = getStartDateEndDateOfWeek(WEEK, YEAR);
          setValues((prev) => ({
            ...prev,
            start_date: renderFormattedPayloadDate(start_date) ?? "",
            end_date: renderFormattedPayloadDate(end_date) ?? "",
          }));
        }}
        value={getWeekString(new Date(values?.start_date)) ?? ""}
      />
    ),
    monthly: (
      <DateInputForm
        type="month"
        onChange={(e) => {
          const value = e.target.value;
          const [year, month] = value.split("-");
          const start_date = new Date(parseInt(year), parseInt(month) - 1, 1);
          const end_date = new Date(parseInt(year), parseInt(month), 0);
          setValues((prev) => ({
            ...prev,
            start_date: renderFormattedPayloadDate(start_date) ?? "",
            end_date: renderFormattedPayloadDate(end_date) ?? "",
          }));
        }}
        value={formatDate(new Date(values?.start_date), "yyyy-MM") ?? ""}
      />
    ),
    yearly: (
      <SelectForm
        options={optionsYearly()}
        className="w-[10rem]"
        value={values?.start_date?.slice(0, 4)}
        onChange={(e) => {
          setValues((prev) => ({
            ...prev,
            start_date: `${e.target.value}-01-01`,
            end_date: `${e.target.value}-12-31`,
          }));
        }}
      />
    ),
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SelectForm
        options={[
          {
            label: "รายวัน / Daily",
            value: "daily",
          },
          {
            label: "ช่วงวัน / Period",
            value: "period",
          },
          {
            label: "สัปดาห์ / Week",
            value: "weekly",
          },
          {
            label: "รายเดือน / Monthly",
            value: "monthly",
          },
          {
            label: "รายปี / Yearly",
            value: "yearly",
          },
        ]}
        className="w-full md:w-[14rem]"
        value={values?.mode}
        onChange={(e) => {
          const mode = e.target.value as TValueProductionOptionFilter["mode"];
          const currentWeek = getWeekString(new Date(values?.start_date));
          const dateOfWeek = getStartDateEndDateOfWeek(
            parseInt(currentWeek.split("-W")[1]),
            parseInt(currentWeek.split("-W")[0])
          );
          if (mode === "weekly") {
            setValues((prev) => ({
              ...prev,
              mode,
              start_date: renderFormattedPayloadDate(dateOfWeek.startDate) ?? "",
              end_date: renderFormattedPayloadDate(dateOfWeek.endDate) ?? "",
            }));
          } else if (mode === "daily") {
            setValues((prev) => ({
              ...prev,
              mode,
              start_date: renderFormattedPayloadDate(new Date()) ?? "",
              end_date: renderFormattedPayloadDate(new Date()) ?? "",
            }));
          } else if (mode === "monthly") {
            setValues((prev) => ({
              ...prev,
              mode,
              start_date:
                renderFormattedPayloadDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) ?? "",
              end_date:
                renderFormattedPayloadDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)) ?? "",
            }));
          } else if (mode === "yearly") {
            setValues((prev) => ({
              ...prev,
              mode,
              start_date: `${new Date()?.getFullYear()}-01-01`,
              end_date: `${new Date()?.getFullYear()}-12-31`,
            }));
          } else {
            setValues((prev) => ({
              ...prev,
              mode,
              start_date: renderFormattedPayloadDate(new Date()) ?? "",
              end_date: renderFormattedPayloadDate(new Date()) ?? "",
            }));
          }
        }}
      />

      {inputDate[values?.mode]}

      <SelectForm
        options={processList?.map((info) => ({
          label: info?.process_name,
          value: info?.process_id,
        }))}
        className="w-full md:w-[10rem]"
        value={values?.process_id}
        onChange={(e) => {
          setValues({
            ...values,
            process_id: e.target.value,
          });
        }}
      />

      <SelectForm
        options={[
          {
            label: "กะเช้า / Day",
            value: "DAY",
          },
          {
            label: "กะดึก / Night",
            value: "NIGHT",
          },
        ]}
        className="w-full md:w-[10rem]"
        value={values?.shift}
        onChange={(e) => {
          setValues({
            ...values,
            shift: e.target.value as "DAY" | "NIGHT",
          });
        }}
      />

      {Export && (
        <Button onClick={Export} className="w-full md:w-max">
          Excel Export
        </Button>
      )}
    </div>
  );
};
