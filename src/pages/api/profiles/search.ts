import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get("q") ?? "").trim();
  if (!q) {
    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, apellidos, avatar_url, bio")
    .or(`nombre.ilike.%${q}%,apellidos.ilike.%${q}%`)
    .limit(20);

  if (error) {
    console.error(error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
};
