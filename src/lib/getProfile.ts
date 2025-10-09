import { createClient } from "@supabase/supabase-js";

// Minimal typing for the cookies object used in SSR environments.
// Matches the shape used in Astro/Next-like runtimes: cookies.get(name)?.value
type CookieLike = {
  get(name: string): { value: string } | undefined;
};

export async function getProfile(cookies: CookieLike) {
  const token = cookies.get("sb-access-token")?.value;
  console.log("🟢 Token leído desde cookies:", token ? "Existe" : "No existe");

  if (!token) return { user: null, profile: null };

  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log("🟢 Usuario obtenido:", user?.email ?? "Ninguno");
  if (userError) console.error("❌ Error en getUser():", userError.message);

  if (!user) return { user: null, profile: null };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) console.error("❌ Error en profiles:", profileError.message);
  console.log("📄 Perfil encontrado:", profile ?? "Ninguno");

  return { user, profile };
}
