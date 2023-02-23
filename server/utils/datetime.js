const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const getDateTimeFromTime = (time) => {
  if (!time) return null;

  const hour = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(3, 2));

  const dateUTC = new Date(1970, 0, 1, hour, minutes);

  const dateIST = dateUTC;
  dateIST.setHours(dateUTC.getHours() + 5);
  dateIST.setMinutes(dateUTC.getMinutes() + 30);

  return dateIST;
};

export const getDateTimeFromDate = (date) => {
  if (!date) return null;

  const dateUTC = new Date(date);
  dateUTC.setHours(0, 0, 0, 0);

  const dateIST = dateUTC;
  dateIST.setHours(dateUTC.getHours() + 5);
  dateIST.setMinutes(dateUTC.getMinutes() + 30);

  return dateIST;
};

export const getDayFromDate = (date) => {
  if (!date) return null;

  const dayIndex = new Date(date).getDay();

  return days[dayIndex];
};
