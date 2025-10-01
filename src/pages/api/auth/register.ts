import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseServer = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const nombre = formData.get("nombre")?.toString();
  const apellidos = formData.get("apellidos")?.toString();
  const telefono = formData.get("telefono")?.toString();

  if (!email || !password || !nombre) {
    return new Response("Nombre, correo y contraseña son obligatorios", { status: 400 });
  }

  // 🔽 Primero subimos avatar si existe
  let avatarUrl = null;
  const avatarFile = formData.get("avatar") as File;
  if (avatarFile && avatarFile.size > 0) {
    const fileName = `${crypto.randomUUID()}-${avatarFile.name}`;
    const { error: uploadError } = await supabaseServer.storage
      .from("avatars")
      .upload(fileName, avatarFile, { cacheControl: "3600", upsert: false });

    if (!uploadError) {
      const { data: publicUrl } = supabaseServer.storage
        .from("avatars")
        .getPublicUrl(fileName);
      avatarUrl = publicUrl.publicUrl;
    }
  }

  // 🔽 Creamos usuario con metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${nombre} ${apellidos ?? ""}`,
        avatar_url: avatarUrl,
        telefono,
      },
    },
  });

  if (error) {
    console.error("Error en signUp:", error.message);
    return new Response(error.message, { status: 500 });
  }

  return redirect("https://browser.facetec.com/");
};
