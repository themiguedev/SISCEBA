import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ctoiqqzrxgqxmdhsgyby.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_HYfs8uxFG2UV_8bMpO30vQ_orCqmwJ4';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const supabaseUrl = (rawUrl && !rawUrl.includes('tu-proyecto') && rawUrl.startsWith('https://'))
  ? rawUrl
  : DEFAULT_SUPABASE_URL;

const supabaseAnonKey = (rawKey && !rawKey.includes('tu-clave-anon'))
  ? rawKey
  : DEFAULT_SUPABASE_ANON_KEY;

/**
 * Verifica si las variables de entorno o credenciales por defecto para Supabase están provistas y tienen un formato válido.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

/**
 * Prueba la conectividad real con la base de datos de Supabase realizando una consulta liviana.
 */
export const checkSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase no está configurado en .env (operando en Modo Local).'
    };
  }

  try {
    const { error } = await supabase.from('subject_areas').select('id').limit(1);
    if (error) {
      // Si el error es que la tabla aún no existe, el servidor Supabase respondió correctamente
      if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
        return {
          connected: true,
          message: 'Conectado a Supabase (Pendiente ejecutar schema.sql en SQL Editor)'
        };
      }
      return {
        connected: false,
        message: `Error al consultar Supabase: ${error.message}`
      };
    }
    return {
      connected: true,
      message: 'Conexión exitosa con la base de datos de Supabase.'
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error de red';
    return {
      connected: false,
      message: `No se pudo alcanzar el servidor Supabase: ${errorMsg}`
    };
  }
};
