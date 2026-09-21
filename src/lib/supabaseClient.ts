import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Verifica si las variables de entorno para Supabase están provistas y tienen un formato válido.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  const trimmedUrl = supabaseUrl.trim();
  const trimmedKey = supabaseAnonKey.trim();

  if (
    trimmedUrl === '' ||
    trimmedUrl.includes('tu-proyecto') ||
    trimmedUrl.includes('your-project') ||
    !trimmedUrl.startsWith('https://')
  ) {
    return false;
  }

  if (
    trimmedKey === '' ||
    trimmedKey.includes('tu-clave-anon') ||
    trimmedKey.includes('your-anon-key')
  ) {
    return false;
  }

  return true;
};

// Si las credenciales no están presentes, proveemos una URL y clave dummy para instanciar el cliente sin romper la app.
const dummyUrl = 'https://placeholder-sicecba.supabase.co';
const dummyKey = 'placeholder-key';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl!.trim() : dummyUrl,
  isSupabaseConfigured() ? supabaseAnonKey!.trim() : dummyKey,
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
      // Si la tabla no existe o error de auth
      return {
        connected: false,
        message: `Error al consultar Supabase: ${error.message}`
      };
    }
    return {
      connected: true,
      message: 'Conexión exitosa con la base de datos de Supabase.'
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `No se pudo alcanzar el servidor Supabase: ${err?.message || 'Error de red'}`
    };
  }
};
