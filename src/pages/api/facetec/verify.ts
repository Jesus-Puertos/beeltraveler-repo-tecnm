import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = supabaseServer(cookies);
  const formData = await request.formData();
  const userId = formData.get("user_id")?.toString();
  if (!userId) return new Response("Falta user_id", { status: 400 });

  await supabase.from("profiles")
    .update({ facetec_status: "verified" })
    .eq("id", userId);

  return redirect("/dashboard");
};
