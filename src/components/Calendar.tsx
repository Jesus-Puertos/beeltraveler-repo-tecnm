import React, { useState } from "react";
import Modal from "./Modal";
import eventsData from "./data/events.json";

type Event = { title: string; description: string };
type EventsMap = Record<string, Event[]>;

export default function Calendar() {
  const today = new Date();

  // 👉 ahora empieza con la fecha actual
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0 = enero

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const totalDays = daysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  function handleClick(day: number) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateKey);
    setSelectedEvents((eventsData as EventsMap)[dateKey] || []);
    setShow(true);
  }

  function prevMonth() {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }

  function nextMonth() {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }

  return (
    <div className="calendar">
      {/*Titulo principal */}
      <h2 className="calendar-title">Calendario de Eventos</h2>
      {/* 🔹 Header con mes/año */}
      <div className="calendar-header">
        <h3 className="month-title">{monthNames[currentMonth]} {currentYear}</h3>
        <div className="nav-group">
          <button className="nav-arrow" onClick={prevMonth}> &lt;  </button>
          <button className="nav-arrow" onClick={nextMonth}> &gt; </button>
        </div>
        
      </div>

      {/* 🔹 Días de la semana */}
      <div className="weekdays">
        <div>Dom</div><div>Lun</div><div>Mar</div>
        <div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
      </div>

      {/* 🔹 Días del mes */}
      <div className="grid-calendar">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="day empty" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          // 👉 día de hoy
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          // 👉 días con eventos
          const hasEvents = (eventsData as EventsMap)[dateKey]?.length > 0;

          return (
            <div
              key={day}
              className={`day ${isToday ? "today" : ""} ${hasEvents ? "event" : ""}`}
              onClick={() => handleClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 🔹 Modal de eventos */}
      <Modal
        show={show}
        date={selectedDate}
        events={selectedEvents}
        onClose={() => setShow(false)}
      />
    </div>
  );
}
