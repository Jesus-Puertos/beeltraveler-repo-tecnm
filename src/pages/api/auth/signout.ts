import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // ✅ Inicializa supabase en el server
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${cookies.get("sb-access-token")?.value ?? ""}` }
      }
    }
  );

  // ✅ Llama al signOut para invalidar refresh token en el server
  await supabase.auth.signOut();

  // ✅ Borra las cookies manualmente
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return redirect("/signin");
};
