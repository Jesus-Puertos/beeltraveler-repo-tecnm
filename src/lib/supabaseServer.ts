import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!

export function supabaseServer(cookies?: any) {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      storage: cookies ? {
        getItem: (key: string) => cookies.get(key)?.value,
        setItem: (key: string, value: string) => cookies.set(key, value),
        removeItem: (key: string) => cookies.delete(key),
      } : undefined,
    },
  })
}