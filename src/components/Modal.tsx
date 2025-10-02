import React from "react";
import { googleCalendarLink, icsFile } from "./calendarLinks";


type Event = {
  title: string;
  description: string;
  image?: string;
  place?: string;
  time?: string;
  endTime?: string;
};

interface ModalProps {
  show: boolean;
  date: string | null;
  events: Event[];
  onClose: () => void;
}

export default function Modal({ show, date, events, onClose }: ModalProps) {
  if (!show || !date) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 className="modal-title">Eventos culturales — {date}</h2>

        {events.length > 0 ? (
          <ul className="event-list">
            {events.map((ev, i) => (
              <li key={i} className="event-item">
                {ev.image && (
                  <img src={ev.image} alt={ev.title} className="event-img" />
                )}
                <div className="event-info">
                  <h3>{ev.title}</h3>
                  <h4>{ev.place}</h4>
                  <h4>{ev.time} {ev.endTime ? `- ${ev.endTime}` : ""}</h4>
                  <p>{ev.description}</p>

                  {/* 🔽 NUEVO: botones de calendario */}
                  <div className="calendar-actions">
                    <a
                      href={googleCalendarLink({
                        title: ev.title,
                        description: ev.description,
                        date,
                        startTime: ev.time || "10:00",
                        endTime: ev.endTime || "12:00",
                        location: ev.place
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
                        startTime: ev.time|| "10:00",
                        endTime: ev.endTime || "12:00",
                        location: ev.place
                      })}
                      download={`${ev.title}.ics`}
                      className="calendar-btn"
                    >
                      📂 Descargar .ICS
                    </a>
                  </div>
                </div>
              </li>
            ))}

          </ul>
        ) : (
          <p className="empty">No hay eventos culturales en esta fecha.</p>
        )}
      </div>
    </div>
  );
}
