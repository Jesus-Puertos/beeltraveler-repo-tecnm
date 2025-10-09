import { googleCalendarLink, icsFile } from "./CalendarLinks";

// ModalEvent soporta tanto el formato original usado por este componente
// (image, time, endTime) como el formato que viene desde la tabla `events`
// (image_url, start_time, end_time). Esto evita errores de tipo al pasar
// datos desde `Calendar.tsx` sin introducir una dependencia circular.
type ModalEvent = {
  id?: string;
  title: string;
  description: string;
  // formatos de imagen
  image?: string | null;
  image_url?: string | null;
  // lugar
  place?: string | null;
  // formatos de tiempo
  time?: string | null;
  endTime?: string | null;
  start_time?: string | null;
  end_time?: string | null;
};

interface ModalProps {
  show: boolean;
  date: string | null;
  events: ModalEvent[];
  onClose: () => void;
}

export default function Modal({ show, date, events, onClose }: ModalProps) {
  if (!show || !date) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>
          <h2 className="modal-title">Eventos culturales — {date}</h2>

          {events.length > 0 ? (
            <ul className="event-list">
              {events.map((ev, i) => {
                const img = ev.image || ev.image_url || undefined;
                const start = ev.time || ev.start_time || "10:00";
                const end = ev.endTime || ev.end_time || "12:00";

                return (
                  <li key={ev.id ?? i} className="event-item">
                    {img && (
                      <img src={img} alt={ev.title} className="event-img" />
                    )}
                    <div className="event-info">
                      <h3>{ev.title}</h3>
                      {ev.place && <h4>{ev.place}</h4>}
                      {(start || end) && (
                        <h4>
                          {start} {end ? `- ${end}` : ""}
                        </h4>
                      )}
                      <p>{ev.description}</p>

                      <div className="calendar-actions">
                        <a
                          href={googleCalendarLink({
                            title: ev.title,
                            description: ev.description,
                            date,
                            startTime: start,
                            endTime: end,
                            location: ev.place ?? undefined
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="calendar-btn"
                        >
                          📅 Google Calendar
                        </a>

                        <a
                          href={icsFile({
                            title: ev.title,
                            description: ev.description,
                            date,
                            startTime: start,
                            endTime: end,
                            location: ev.place ?? undefined
                          })}
                          download={`${ev.title}.ics`}
                          className="calendar-btn"
                        >
                          📂 Descargar .ICS
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="empty">No hay eventos culturales en esta fecha.</p>
          )}
        </div>
      </div>

      {/* 🔽 Estilos embebidos */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          max-width: 520px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.3s ease;
          border-top: 5px solid #22c55e;
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          border: none;
          background: none;
          font-size: 1.3rem;
          cursor: pointer;
          color: #666;
          transition: color 0.2s ease;
        }

        .close-btn:hover {
          color: #111;
        }

        .modal-title {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111;
          text-align: center;
        }

        .event-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .event-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }

        .event-img {
          width: 150px;
          height: 150px;
          border-radius: 10px;
          object-fit: cover;
          margin-right: 1rem;
        }

        .event-info {
          flex: 1;
          min-width: 0;
        }

        .event-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #111;
        }

        .event-info h4 {
          margin: 0.2rem 0;
          font-size: 0.9rem;
          color: #333;
        }

        .event-info p {
          margin-top: 0.5rem;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
          color: #444;
          font-size: 0.9rem;
        }

        .empty {
          text-align: center;
          color: #888;
          font-size: 0.9rem;
        }

        .calendar-actions {
          margin-top: 0.8rem;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .calendar-btn {
          display: inline-block;
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          background: #fff;
          color: #111;
          text-decoration: none;
          border: 1px solid #22c55e;
          transition: all 0.2s ease;
        }

        .calendar-btn:hover {
          background: #22c55e;
          color: #fff;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}