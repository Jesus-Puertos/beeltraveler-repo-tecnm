export function googleCalendarLink({
  title,
  description,
  date,       // YYYY-MM-DD
  startTime,  // HH:mm (24h)
  endTime,    // HH:mm (24h)
  location,
}: {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
}) {
  if (!date || !startTime || !endTime) return "#";

  // Google Calendar usa formato UTC: YYYYMMDDTHHmmssZ
  const start = `${date.replace(/-/g, "")}T${startTime.replace(":", "")}00Z`;
  const end = `${date.replace(/-/g, "")}T${endTime.replace(":", "")}00Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${start}/${end}`,
  });

  if (location) {
    params.set("location", location);
  }

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function icsFile({
  title,
  description,
  date,       // YYYY-MM-DD
  startTime,  // HH:mm (24h)
  endTime,    // HH:mm (24h)
  location,
}: {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
}) {
  if (!date || !startTime || !endTime) return "#";

  const start = `${date.replace(/-/g, "")}T${startTime.replace(":", "")}00Z`;
  const end = `${date.replace(/-/g, "")}T${endTime.replace(":", "")}00Z`;

  return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
${location ? `LOCATION:${location}` : ""}
END:VEVENT
END:VCALENDAR`;
}
