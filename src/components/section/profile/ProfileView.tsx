import { useState } from "react";

type User = {
  id: string;
  nombre?: string;
  apellidos?: string;
  avatar_url?: string;
  bio?: string;
};

type ProfileViewProps = {
  profile: User;
  currentUser?: User;
  initialFollowers?: any[];
  initialFollowing?: any[];
  isFollowing: boolean;
};

export default function ProfileView({
  profile,
  currentUser,
  initialFollowers,
  initialFollowing,
  isFollowing,
}: ProfileViewProps) {
  const [followers, setFollowers] = useState(initialFollowers || []);
  const [following, setFollowing] = useState(initialFollowing || []);
  const [followingStatus, setFollowingStatus] = useState(isFollowing);

  // 🔹 Estados para mensajes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // ✅ Toggle follow
  const toggleFollow = async () => {
    const res = await fetch("/api/follows/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: profile.id }),
    });

    if (res.ok) {
      const data = await res.json();
      setFollowingStatus(data.following);
      await refreshFollowers();
    }
  };

  // ✅ Refrescar seguidores
  const refreshFollowers = async () => {
    const res = await fetch("/api/follows/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.id }),
    });
    const data = await res.json();
    setFollowers(data.followers);
    setFollowing(data.following);
  };

  // ✅ Enviar mensaje
  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: profile.id,
        content: messageContent,
      }),
    });

    if (res.ok) {
      alert("Mensaje enviado ✅");
      setMessageContent("");
      setIsModalOpen(false);
    } else {
      alert("❌ Error al enviar mensaje");
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-8 px-4">
      {/* 📌 Portada */}
      <div className="relative">
        <div className="h-40 md:h-56 w-full rounded-3xl overflow-hidden shadow-xl">
          <img src="https://images.unsplash.com/photo-1503264116251-35a269479413" alt="Portada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
        </div>

        <div className="absolute -bottom-16 md:-bottom-12 left-0 right-0 px-4 md:px-8">
          <div className="mx-auto grid grid-cols-[auto,1fr] gap-4 items-start rounded-2xl md:rounded-3xl bg-white/85 dark:bg-emerald-900/85 backdrop-blur-xl shadow-2xl p-4 md:p-6">
            <img src={profile.avatar_url ?? "/default-avatar.webp"} alt="Avatar" className="h-20 w-20 md:h-24 md:w-24 rounded-full ring-4 ring-white/70 object-cover" />

            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight text-emerald-900 dark:text-white truncate">
                  {profile.nombre} {profile.apellidos}
                </h1>
                {currentUser?.id === profile.id ? (
                  <a
                    href="/perfil/editar"
                    className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm md:text-base font-medium hover:bg-emerald-500"
                  >
                    Editar
                  </a>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={toggleFollow}
                      className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm md:text-base font-medium hover:bg-emerald-500"
                    >
                      {followingStatus ? "✓ Siguiendo" : "+ Seguir"}
                    </button>
                    <button
                      onClick={() => (window.location.href = `/chat/${profile.id}`)}
                      className="px-3 py-1.5 rounded-full border border-emerald-300/60 text-emerald-700 dark:text-emerald-300 text-sm md:text-base"
                    >
                      Mensaje
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-6 text-center">
                <div>
                  <p className="text-base md:text-lg font-bold text-emerald-800 dark:text-emerald-200">0</p>
                  <span className="text-xs text-gray-500">Publicaciones</span>
                </div>
                <div>
                  <p className="text-base md:text-lg font-bold text-emerald-800 dark:text-emerald-200">{followers.length}</p>
                  <span className="text-xs text-gray-500">Seguidores</span>
                </div>
                <div>
                  <p className="text-base md:text-lg font-bold text-emerald-800 dark:text-emerald-200">{following.length}</p>
                  <span className="text-xs text-gray-500">Siguiendo</span>
                </div>
              </div>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                {profile.bio ?? "Este usuario aún no ha escrito una biografía."}
              </p>
            </div>
          </div>
        </div>
        {/* Spacer para que el contenido no se superponga con la tarjeta flotante */}
        <div className="h-24 md:h-16" />
      </div>

      {/* 📌 Seguidores */}
      <div className="mt-4 md:mt-2">
        <div className="mx-auto bg-white/70 dark:bg-emerald-900/60 backdrop-blur-md rounded-2xl shadow-xl p-2 md:p-3 max-w-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button className="py-2 rounded-xl bg-emerald-600 text-white font-medium">Seguidores</button>
            <button className="py-2 rounded-xl text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50/60 dark:hover:bg-white/5">Siguiendo</button>
          </div>
        </div>
      </div>
      <h2 className="font-bold text-lg mb-4">Seguidores</h2>
      <ul className="space-y-2">
        {followers.map((f) => (
          <li key={f.id} className="flex items-center gap-3">
            <img
              src={f.profiles.avatar_url ?? "/default-avatar.webp"}
              className="h-8 w-8 rounded-full"
            />
            <span>
              {f.profiles.nombre} {f.profiles.apellidos}
            </span>
          </li>
        ))}
      </ul>

      {/* 📌 Siguiendo */}
      <div className="mt-8 bg-white/80 dark:bg-emerald-900/70 backdrop-blur-md border rounded-2xl shadow p-4 md:p-6">
        <h2 className="font-bold text-lg mb-4">Siguiendo</h2>
        <ul className="space-y-2">
          {following.map((f) => (
            <li key={f.id} className="flex items-center gap-3">
              <img
                src={f.profiles.avatar_url ?? "/default-avatar.webp"}
                className="h-8 w-8 rounded-full"
              />
              <span>
                {f.profiles.nombre} {f.profiles.apellidos}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 📌 Modal de mensajes */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-emerald-900 p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold">Enviar mensaje</h2>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="w-full border rounded p-2 mt-2"
              rows={4}
              placeholder="Escribe tu mensaje..."
            />
            <div className="flex justify-end mt-3 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={sendMessage}
                className="px-3 py-1 bg-emerald-600 text-white rounded"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
