import { useEffect, useState } from "react";
import Modal from "./Modal";
import { createClient } from "@supabase/supabase-js";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  place: string | null;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  image_url?: string | null;
};

type EventsMap = Record<string, CalendarEvent[]>;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
);

export default function CalendarComponent() {
  const today = new Date();
  const [eventsMap, setEventsMap] = useState<EventsMap>({});
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();
  const totalDays = daysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // 🔄 Obtener eventos desde Supabase
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("id, title, description, place, date, start_time, end_time, image_url");

      if (error) {
        console.error("❌ Error al cargar eventos:", error.message);
        setLoading(false);
        return;
      }

      const grouped: EventsMap = {};
      data?.forEach((event) => {
        const dateKey = event.date;
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
      });

      setEventsMap(grouped);
      setLoading(false);
    }

    fetchEvents();
  }, []);

  function handleClick(day: number) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateKey);
    setSelectedEvents(eventsMap[dateKey] || []);
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
      <div className="calendar-container">
        <h2 className="calendar-title">Calendario de Eventos</h2>

        <div className="calendar-header">
          <button className="nav-arrow" onClick={prevMonth}>‹</button>
          <h3 className="month-title">{monthNames[currentMonth]} {currentYear}</h3>
          <button className="nav-arrow" onClick={nextMonth}>›</button>
        </div>

        <div className="weekdays">
          <div>Dom</div><div>Lun</div><div>Mar</div>
          <div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
        </div>

        {loading ? (
          <div className="loading">Cargando eventos...</div>
        ) : (
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

              const hasEvents = eventsMap[dateKey]?.length > 0;

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
        )}

        <Modal
          show={show}
          date={selectedDate}
          events={selectedEvents}
          onClose={() => setShow(false)}
        />
      </div>

      <style>{`
        .calendar-container {
          max-width: 800px;
          padding: 2rem;
          background: #ffffff;
          border-radius: 1rem;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          color: #111;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .calendar-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1.5rem;
          color: #065f46;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .month-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #111;
        }

        .nav-arrow {
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nav-arrow:hover {
          background: #16a34a;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 0.8rem;
        }

        .grid-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .day {
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #111;
          border: 1px solid #ddd;
        }

        .day:hover {
          background: #e6f5ec;
          transform: translateY(-2px);
        }

        .day.today {
          border: 2px solid #22c55e;
          background: #deeee3;
          font-weight: 700;
        }

        .day.event {
          background: #aee6c5;
          border: 2px solid #22c55e;
          position: relative;
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

        .day.empty {
          background: transparent;
          border: none;
        }

        .loading {
          text-align: center;
          color: #666;
          font-size: 1rem;
          margin: 2rem 0;
        }
      `}</style>
    </>
  );
}
