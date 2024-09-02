// export const API_BASE_URL = "http://10.1.8.175:3000/api";

// export const API_BASE_URL = "https://api-gateway-v1.sncformer.com/toolbox/prd/v1";
export const API_BASE_URL = "https://api-gateway-v1.sncformer.com/iqcs/dev/v1";

export const calculateDateTime = (date: string, time: string) => {
  const [startTime, endTime] = time.split(" - ");
  const [startHour, startMinute] = startTime?.split(":");
  const [endHour, endMinute] = endTime?.split(":");
  const startDate = new Date(date);
  startDate.setHours(Number(startHour));
  startDate.setMinutes(Number(startMinute));
  const endDate = new Date(date);
  endDate.setHours(Number(endHour));
  endDate.setMinutes(Number(endMinute));
  return {
    start: startDate?.toISOString(),
    end: endDate?.toISOString(),
  };
};

export const DEFECT_TYPE = [
  {
    label: "Shop",
    value: "S",
  },
  {
    label: "Part",
    value: "P",
  },
];
