interface TimeSlot {
  label: string;
  value: string;
  date_time?: string;
  time: string | number;
}
export const getTimeSlots = (): TimeSlot[] => {
  const timeSlots: TimeSlot[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i;
    const startHour = hour.toString().padStart(2, "0");
    const endHour = (hour + 1).toString().padStart(2, "0");
    const label = `${startHour}:00 - ${endHour}:00`;
    const value = `${startHour}:00 - ${endHour}:00`;
    timeSlots.push({
      label,
      value,
      time: `${startHour}:00`,
    });
  }

  return [
    {
      label: "All day",
      value: "00:00 - 23:59",
      time: "00:00 - 23:59",
    },
    ...timeSlots,
  ];
};

export const getNowTimeSlot = (): TimeSlot => {
  const now = new Date();
  const hour = now.getHours();
  const startHour = hour.toString().padStart(2, "0");
  const endHour = (hour + 1).toString().padStart(2, "0");
  const label = `${startHour}:00 - ${endHour}:00`;
  const value = `${startHour}:00 - ${endHour}:00`;
  return {
    label,
    value,
    time: `${startHour}:00`,
  };
};

export const getTimeSlotByDateTimestamp = (timestamp: number): TimeSlot => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const startHour = hour.toString().padStart(2, "0");
  const endHour = (hour + 1).toString().padStart(2, "0");
  const label = `${startHour}:00 - ${endHour}:00`;
  const value = `${startHour}:00 - ${endHour}:00`;
  return {
    label,
    value,
    time: `${startHour}:00`,
  };
};

export const GET_TIME_SLOTS = (date: string | undefined, isShowAllDay: boolean = false) => {
  if (!date) {
    return [];
  }

  const timeSlots = [];
  const startHour = 8;
  const slotDuration = 1;
  const totalSlots = 24;
  const parseDate = new Date(date);
  parseDate.setHours(startHour, 0, 0, 0);
  for (let i = 0; i < totalSlots; i++) {
    const hour = parseDate.getHours();
    const label = `${hour.toString().padStart(2, "0")}:00 - ${(hour + slotDuration).toString().padStart(2, "0")}:00`;
    const value = parseDate?.toISOString();
    timeSlots.push({
      label,
      value: label,
      date_time: value,
      time: parseDate.getTime(),
    });
    parseDate.setHours(hour + slotDuration);
  }

  const allDay = {
    label: "All day",
    value: "08:00 - 08:00",
    date_time: parseDate?.toISOString(),
    time: parseDate.getTime(),
  };

  return isShowAllDay ? [allDay, ...timeSlots] : timeSlots;
};

export const GET_NOW_TIME_SLOT = (date: string | undefined): TimeSlot => {
  const TIME_SLOT = GET_TIME_SLOTS(date);
  const now = new Date();
  const hour = now.getHours();
  const startHour = hour.toString().padStart(2, "0");
  const endHour = (hour + 1).toString().padStart(2, "0");
  const label = `${startHour}:00 - ${endHour}:00`;

  const timeSlot = TIME_SLOT?.find((slot) => slot.value === label);
  return timeSlot ?? TIME_SLOT[0];
};
