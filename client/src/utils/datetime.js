export const formatDate = (date) => {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toDateString("en-US", options).substr(4, 6);
};

export const formatTime = (time) => {
  return time.substr(11, 5);
};

export const timeDifference = (time1, time2) => {
  const difference = new Date(time1).getTime() - new Date(time2).getTime();

  const differenceDate = new Date(difference);

  differenceDate.setHours(differenceDate.getHours() - 5);
  differenceDate.setMinutes(differenceDate.getMinutes() - 30);

  const hours = differenceDate.getHours();
  const minutes = differenceDate.getMinutes();

  return `${hours}h ${minutes}m `;
};
