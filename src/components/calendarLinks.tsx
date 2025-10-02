export function googleCalendarLink({
  title,
  description,
  date,
}: {
  title: string;
  description: string;
  date: string;
}) {
  if (!date) return "#";

  const start = `${date.replace(/-/g, "")}T100000Z`;
  const end = `${date.replace(/-/g, "")}T120000Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${start}/${end}`,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function icsFile({
  title,
  description,
  date,
}: {
  title: string;
  description: string;
  date: string;
}) {
  if (!date) return "#";

  const start = `${date.replace(/-/g, "")}T100000Z`;
  const end = `${date.replace(/-/g, "")}T120000Z`;

  return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;
}
