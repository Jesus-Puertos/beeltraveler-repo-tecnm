import React, { useState } from "react";
import Modal from "./Modal";
import eventsData from "./data/events.json";

type Event = { title: string; description: string };
type EventsMap = Record<string, Event[]>;

export default function Calendar() {
  const currentYear = 2021;
  
  const currentMonth = 1;

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate();

  const totalDays = daysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  function handleClick(day: number) {
    const dateKey = `${currentYear}-01-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateKey);
    setSelectedEvents((eventsData as EventsMap)[dateKey] || []);
    setShow(true);
  }

  return (
    <div className="calendar">
      <div className="weekdays">
        <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div>
        <div>Jue</div><div>Vie</div><div>Sáb</div>
      </div>
      <div className="grid">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="day empty" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={day}
              className="day"
              onClick={() => handleClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      <Modal
        show={show}
        date={selectedDate}
        events={selectedEvents}
        onClose={() => setShow(false)}
      />
    </div>
  );
}
