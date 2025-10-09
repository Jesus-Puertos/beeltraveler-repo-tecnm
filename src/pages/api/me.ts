import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ isLoggedIn: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    import.meta.env.SUPABASE_URL!,
    import.meta.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ isLoggedIn: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("nombre, avatar_url, rol")
    .eq("id", user.id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const isOrg = profile?.rol === "organizacion";

  return new Response(
    JSON.stringify({
      isLoggedIn: true,
      isOrg,
      user: { id: user.id, email: user.email },
      profile,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
