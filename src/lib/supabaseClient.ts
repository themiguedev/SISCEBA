/**
 * Adaptador de compatibilidad hacia el cliente de Base de Datos Nativo Local.
 * Permite que cualquier módulo existente continúe funcionando sin depender de Supabase.
 */

import {
  db,
  isDatabaseConfigured,
  checkDatabaseConnection,
  getActiveApiUrl
} from './dbClient';

export const supabase = db;
export const isSupabaseConfigured = isDatabaseConfigured;
export const checkSupabaseConnection = checkDatabaseConnection;
export const getActiveSupabaseUrl = getActiveApiUrl;
export default db;
