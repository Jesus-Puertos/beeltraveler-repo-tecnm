import React from "react";

type Event = { title: string; description: string };

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
        <h2>Eventos para {date}</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((ev, i) => (
              <li key={i}>
                <strong>{ev.title}</strong>: {ev.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay eventos.</p>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
