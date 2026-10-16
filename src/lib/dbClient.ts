/**
 * Cliente de Base de Datos Nativo Local y de Red SICE-CBA
 * Conecta directamente al servidor API REST local de PostgreSQL sin depender de Supabase.
 */

export interface DbResult<T = any> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export class QueryFilterBuilder<T = Record<string, any>[]> {
  private filters: string[] = [];

  constructor(
    private table: string,
    private baseUrl: string,
    private method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    private payload?: any,
    private selectCols = '*'
  ) {
    if (this.method === 'GET' && this.selectCols) {
      this.filters.push(`select=${encodeURIComponent(this.selectCols)}`);
    }
  }

  eq(column: string, value: any): QueryFilterBuilder<T> {
    this.filters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(String(value))}`);
    return this;
  }

  neq(column: string, value: any): QueryFilterBuilder<T> {
    this.filters.push(`${encodeURIComponent(column)}=neq.${encodeURIComponent(String(value))}`);
    return this;
  }

  ilike(column: string, value: any): QueryFilterBuilder<T> {
    this.filters.push(`${encodeURIComponent(column)}=ilike.${encodeURIComponent(String(value))}`);
    return this;
  }

  or(filterStr: string): QueryFilterBuilder<T> {
    this.filters.push(`or=${encodeURIComponent(filterStr)}`);
    return this;
  }

  limit(count: number): QueryFilterBuilder<T> {
    this.filters.push(`limit=${count}`);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): QueryFilterBuilder<T> {
    const dir = options?.ascending === false ? 'desc' : 'asc';
    this.filters.push(`order=${encodeURIComponent(column)}.${dir}`);
    return this;
  }

  private buildUrl(): string {
    const query = this.filters.length > 0 ? `?${this.filters.join('&')}` : '';
    return `${this.baseUrl}/api/${this.table}${query}`;
  }

  async execute(): Promise<DbResult<T>> {
    try {
      const url = this.buildUrl();
      const options: RequestInit = {
        method: this.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (this.payload && (this.method === 'PATCH' || this.method === 'POST')) {
        options.body = JSON.stringify(this.payload);
      }

      // Timeout defensivo de 15 segundos para evitar cuelgues indefinidos en red lenta
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      options.signal = controller.signal;

      const res = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!res.ok) {
        let errText = res.statusText;
        try {
          const errJson = await res.json();
          errText = errJson.error || errJson.message || errText;
        } catch {}
        return { data: null, error: { message: errText } };
      }

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }
      return { data, error: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { data: null, error: { message: msg } };
    }
  }

  async maybeSingle<R = T extends (infer U)[] ? U : T>(): Promise<DbResult<R>> {
    const res = await this.execute();
    if (res.error) {
      return { data: null, error: res.error };
    }
    const val = res.data;
    if (Array.isArray(val)) {
      return { data: (val.length > 0 ? val[0] : null) as R | null, error: null };
    }
    return { data: (val ?? null) as R | null, error: null };
  }

  async single<R = T extends (infer U)[] ? U : T>(): Promise<DbResult<R>> {
    const res = await this.maybeSingle<R>();
    if (!res.error && res.data === null) {
      return { data: null, error: { message: 'Registro no encontrado' } };
    }
    return res;
  }

  then<TResult1 = DbResult<T>, TResult2 = never>(
    onfulfilled?: ((value: DbResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export class TableQueryBuilder {
  constructor(private table: string, private baseUrl: string) {}

  select<R = Record<string, any>[]>(cols = '*'): QueryFilterBuilder<R> {
    return new QueryFilterBuilder<R>(this.table, this.baseUrl, 'GET', undefined, cols);
  }

  async upsert(recordOrRecords: any): Promise<DbResult> {
    try {
      const url = `${this.baseUrl}/api/${this.table}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordOrRecords),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        let errMsg = res.statusText;
        try {
          const j = await res.json();
          errMsg = j.error || errMsg;
        } catch {}
        return { data: null, error: { message: errMsg } };
      }
      const data = await res.json();
      return { data, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { data: null, error: { message: msg } };
    }
  }

  update(fields: any): QueryFilterBuilder<Record<string, any>[]> {
    return new QueryFilterBuilder(this.table, this.baseUrl, 'PATCH', fields);
  }

  delete(): QueryFilterBuilder<Record<string, any>[]> {
    return new QueryFilterBuilder(this.table, this.baseUrl, 'DELETE');
  }
}

export class DatabaseClient {
  constructor(private getBaseUrl: () => string) {}

  from(table: string): TableQueryBuilder {
    return new TableQueryBuilder(table, this.getBaseUrl());
  }
}

/**
 * Determina dinámicamente la URL base del servidor API según el entorno:
 * - En navegador (localhost, red local 172.16.7.x, o túnel Cloudflare HTTPS):
 *   Usa window.location.origin para que las peticiones vayan al proxy /api del mismo host
 *   y evite bloqueos por CORS, Mixed Content o puertos externos cerrados (54321).
 * - En Node.js / entornos sin ventana:
 *   Conecta directamente a http://127.0.0.1:54321
 */
export const getActiveApiUrl = (): string => {
  if (
    typeof window !== 'undefined' &&
    window.location?.origin &&
    window.location.origin !== 'null' &&
    !window.location.protocol.startsWith('file')
  ) {
    return window.location.origin;
  }
  return 'http://127.0.0.1:54321';
};

export const isDatabaseConfigured = (): boolean => true;

// Instancia única del cliente nativo de base de datos
export const db = new DatabaseClient(getActiveApiUrl);

/**
 * Diagnóstico de conexión con el motor PostgreSQL local
 */
export const checkDatabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  try {
    const { data, error } = await db.from('subject_areas').select('id').limit(1);
    if (error || !data) {
      return {
        connected: false,
        message: 'No se pudo conectar con el motor PostgreSQL local.'
      };
    }
    return {
      connected: true,
      message: 'Conexión activa con el motor PostgreSQL local y en red.'
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error de red';
    return {
      connected: false,
      message: `Error al contactar el servidor local: ${errorMsg}`
    };
  }
};
