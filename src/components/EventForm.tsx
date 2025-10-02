import React, { useState, useEffect } from "react";

type Event = {
  title: string;
  description: string;
  place: string;
  date: string;
  startTime: string;
  endTime: string;
  image?: string;
};

export default function EventForm() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [code, setCode] = useState("");
  const [event, setEvent] = useState<Event>({
    title: "",
    description: "",
    place: "",
    date: "",
    startTime: "",
    endTime: "",
    image: "",
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState<string>("");

  // 🔄 Cargar eventos guardados al inicio
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // 📝 Mostrar notificación bonita (texto dentro del form)
  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000); // Desaparece en 3s
  }

  function validateOrg() {
    if (code === "ORG123") {
      setIsAuthorized(true);
      showMessage("✅ Organización validada");
    } else {
      showMessage("❌ Código inválido");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);

    // Guardar en localStorage
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    showMessage("🎉 Evento agregado al calendario");

    // Limpiar campos
    setEvent({
      title: "",
      description: "",
      place: "",
      date: "",
      startTime: "",
      endTime: "",
      image: "",
    });
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 space-y-4">
      {message && (
        <div className="text-center text-sm font-medium text-emerald-600 bg-emerald-100 p-2 rounded-md">
          {message}
        </div>
      )}

      {!isAuthorized ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Validar Organización
          </h2>
          <input
            type="text"
            placeholder="Código de organización"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-md p-2 mb-4"
          />
          <button
            onClick={validateOrg}
            className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600"
          >
            Validar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Crear Nuevo Evento
          </h2>

          <input
            type="text"
            placeholder="Título"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            className="w-full border rounded-md p-2"
            required
          />

          <textarea
            placeholder="Descripción"
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            className="w-full border rounded-md p-2"
            rows={3}
          />

          <input
            type="text"
            placeholder="Lugar"
            value={event.place}
            onChange={(e) => setEvent({ ...event, place: e.target.value })}
            className="w-full border rounded-md p-2"
          />

          <input
            type="date"
            value={event.date}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            className="w-full border rounded-md p-2"
            required
          />

          <div className="flex gap-2">
            <input
              type="time"
              value={event.startTime}
              onChange={(e) =>
                setEvent({ ...event, startTime: e.target.value })
              }
              className="flex-1 border rounded-md p-2"
              required
            />
            <input
              type="time"
              value={event.endTime}
              onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
              className="flex-1 border rounded-md p-2"
            />
          </div>

          <input
            type="url"
            placeholder="URL de imagen (opcional)"
            value={event.image}
            onChange={(e) => setEvent({ ...event, image: e.target.value })}
            className="w-full border rounded-md p-2"
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600"
          >
            Guardar Evento
          </button>
        </form>
      )}
    </div>
  );
}
