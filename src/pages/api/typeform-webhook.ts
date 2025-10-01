import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(import.meta.env.SUPABASE_URL!, import.meta.env.SUPABASE_SERVICE_ROLE_KEY!);
const TF_SECRET = import.meta.env.TYPEFORM_SECRET!;

function verifyTypeformSignature(req: Request, rawBody: string) {
  const signature = req.headers.get('typeform-signature') || '';
  const hmac = crypto.createHmac('sha256', TF_SECRET).update(rawBody).digest('base64');
  const expected = `sha256=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export const post: APIRoute = async ({ request }) => {
  const raw = await request.text();

  // Verifica firma
  try {
    if (!verifyTypeformSignature(request, raw)) {
      return new Response('Invalid signature', { status: 401 });
    }
  } catch {
    return new Response('Signature error', { status: 401 });
  }

  const payload = JSON.parse(raw);
  // Extrae hidden fields
  const hidden = payload.form_response?.hidden || {};
  const user_id = hidden.user_id ?? null;
  const email = hidden.email ?? null;

  if (!user_id) {
    // Opcional: guarda como lead anónimo
    return new Response('No user_id, skipping', { status: 200 });
  }

  // Helper para leer respuestas por field ref
  const answers: any[] = payload.form_response?.answers || [];
  const byRef = (ref: string) => answers.find(a => a.field?.ref === ref);

  // Mapea por "ref" (configúralos en Typeform para que sean estables)
  const destination = byRef('destino')?.text || byRef('destino')?.choice?.label || null;
  const party_size = Number(byRef('personas')?.number ?? null) || null;
  const has_pets = byRef('mascotas')?.boolean ?? null;

  const accessibility = {
    wheelchair: !!byRef('acc_silla')?.boolean,
    few_stairs: !!byRef('acc_escaleras')?.boolean,
    signage: !!byRef('acc_senaletica')?.boolean,
    interpreter: !!byRef('acc_interprete')?.boolean,
    quiet: !!byRef('acc_silencio')?.boolean
  };

  const health = {
    declared: !!byRef('salud_confirma')?.boolean,
    notes: byRef('salud_notas')?.text || null
  };

  const budget_total = byRef('presupuesto')?.number ?? null;
  const nights = byRef('noches')?.number ?? null;

  // Fechas (si usas bloque "date" o "date ranges")
  const start = byRef('fecha_inicio')?.date || null;
  const end = byRef('fecha_fin')?.date || null;
  const travel_window = (start && end) ? `[${start},${end}]` : null;

  const activities = (byRef('actividades')?.choices?.labels as string[]) || null;
  const lodging = byRef('alojamiento')?.choice?.label || null;
  const mobility = (byRef('movilidad')?.choices?.labels as string[]) || null;
  const origin_city = byRef('origen')?.text || null;


  // UPSERT en una sola llamada
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id,
      destination,
      party_size,
      has_pets,
      accessibility,
      health,
      budget_total,
      nights,
      travel_window,    // PostgREST acepta formato textual de range
      activities,
      lodging,
      mobility,
      origin_city,
      raw,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) {
    console.error(error);
    return new Response('DB error', { status: 500 });
  }

  return new Response('ok', { status: 200 });
};
