import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "not_authenticated" }), { status: 401 });
  }

  const supabase = createClient(
    import.meta.env.SUPABASE_URL!,
    import.meta.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "not_authenticated" }), { status: 401 });
  }

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (pErr) {
    return new Response(JSON.stringify({ error: pErr.message }), { status: 500 });
  }
  if (profile?.rol !== "organizacion") {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }

  const payload = await request.json();
  const { title, description, place, date, startTime, endTime, image } = payload;

  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      place,
      date,                 // DATE (YYYY-MM-DD)
      start_time: startTime, // TIME
      end_time: endTime,     // TIME
      image,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
