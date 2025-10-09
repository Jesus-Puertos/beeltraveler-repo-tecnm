import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value ?? null;

  if (!accessToken) {
    return new Response(JSON.stringify({ token: null }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ token: accessToken }), {
    headers: { "Content-Type": "application/json" },
  });
};
