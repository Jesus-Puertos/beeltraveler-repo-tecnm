import React, { useState } from "react";
import Modal from "./Modal";
import eventsData from "./data/events.json";

type Event = { title: string; description: string };
type EventsMap = Record<string, Event[]>;

export default function Calendar() {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

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
    <>
      <div className="calendar">
        <h2 className="calendar-title">Calendario de Eventos</h2>

        <div className="calendar-header">
          <h3 className="month-title">{monthNames[currentMonth]} {currentYear}</h3>
          <div className="nav-group">
            <button className="nav-arrow" onClick={prevMonth}> &lt; </button>
            <button className="nav-arrow" onClick={nextMonth}> &gt; </button>
          </div>
        </div>

        <div className="weekdays">
          <div>Dom</div><div>Lun</div><div>Mar</div>
          <div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
        </div>

        <div className="grid-calendar">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="day empty" />
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

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

        <Modal
          show={show}
          date={selectedDate}
          events={selectedEvents}
          onClose={() => setShow(false)}
        />
      </div>

      {/* 🎨 Estilos embebidos */}
      <style>{`
        .calendar {
          max-width: 800px;
          padding: 2rem 1rem;
          font-family: "Inter", sans-serif;
          color: #111;
          background: #fff;
          margin: 0 auto;
        }

        .calendar-title {
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: #111;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .month-title {
          flex: 1;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 600;
          color: #111;
        }

        .nav-group {
          display: flex;
          gap: 0.5rem;
        }

        .nav-arrow {
          background: transparent;
          border: none;
          font-size: 1.6rem;
          font-weight: bold;
          color: #000;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .nav-arrow:hover {
          transform: scale(1.2);
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
          color: #111;
          margin-bottom: 1rem;
          letter-spacing: 0.5px;
        }

        .grid-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .day {
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 500;
          background: #f1f1f1;
          border: 1px solid #ccc;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          color: #333;
        }

        .day:hover {
          background: #e6f5ec;
          border-color: #065824;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .day.empty {
          background: transparent;
          border: none;
          cursor: default;
        }

        .day.today {
          border: 2px solid #22c55e;
          background: #deeee3;
          color: #111;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(14, 163, 69, 0.2);
        }

        .day.event {
          border-color: #22c55e;
          background: #aee6c5;
          font-weight: 600;
        }

        .day.event::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #065f46;
          position: absolute;
          bottom: 6px;
        }
      `}</style>
    </>
  );
}