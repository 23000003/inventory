export const formatTime = (date: Date | string | null) => {
  const dateObj = typeof date === "string" ? 
    new Date(date) : 
      date === null ? 
        new Date() : 
          date;
  return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const dayIdentifier = (date: Date | string): string => {
  const toDate = typeof date === "string" ? new Date(date) : date;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const toDateString = toDate.toDateString();
  const todayString = today.toDateString();
  const yesterdayString = yesterday.toDateString();

  if (toDateString === todayString) return "Today";
  if (toDateString === yesterdayString) return "Yesterday";

  // Otherwise return formatted date: MM/DD/YYYY
  return `${toDate.getMonth() + 1}/${toDate.getDate()}/${toDate.getFullYear()}`;
};