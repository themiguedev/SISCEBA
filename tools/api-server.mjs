import http from 'http';
import url from 'url';
import pg from 'pg';

const { Pool } = pg;
const PORT = 54321;
const PG_CONN_STRING = 'postgres://postgres@127.0.0.1:5432/sisceba';

// Pool de conexiones a PostgreSQL nativo local de alto desempeño
export const pool = new Pool({
  connectionString: PG_CONN_STRING,
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]:', err.message);
});

// Métricas de desempeño en vivo
export const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  errorRequests: 0,
  activeConnections: 0,
  latencies: [],
  startTime: Date.now()
};

// Caches en memoria para introspección del esquema PostgreSQL
const jsonColumnsCache = new Set();
const primaryKeysCache = new Map();

async function refreshSchemaMetadata() {
  try {
    const colRes = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND udt_name IN ('json', 'jsonb');
    `);
    jsonColumnsCache.clear();
    for (const r of colRes.rows) {
      jsonColumnsCache.add(`${r.table_name}.${r.column_name}`);
    }

    const pkRes = await pool.query(`
      SELECT tc.table_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public';
    `);
    primaryKeysCache.clear();
    for (const r of pkRes.rows) {
      primaryKeysCache.set(r.table_name, r.column_name);
    }
  } catch (err) {
    console.warn('[API Metadata Warning]:', err.message);
  }
}

// Cargar metadatos iniciales y asegurar cuentas base
async function initServerState() {
  await refreshSchemaMetadata();
  await ensureInstitutionalUsers();
}

async function ensureInstitutionalUsers() {
  try {
    const baseUsers = [
      {
        id: 'usr-admin',
        username: 'admin',
        password: 'cba2026*admin',
        full_name: 'Administrador General de Sistemas',
        email: 'admin@bellasartes.edu.ve',
        role: 'ADMINISTRADOR',
        default_level: 'MEDIA_GENERAL',
        active: true,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      }
    ];

    for (const u of baseUsers) {
      await pool.query(`
        INSERT INTO app_users (id, username, password, full_name, email, role, default_level, active, avatar_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (username) DO NOTHING
      `, [u.id, u.username, u.password, u.full_name, u.email, u.role, u.default_level, u.active, u.avatar_url]);
    }
  } catch (err) {
    console.warn('[Institutional Users Notice]:', err.message);
  }
}

initServerState();

function parseFilter(key, rawValue) {
  if (typeof rawValue !== 'string') return null;

  if (rawValue === 'is.null') {
    return { clause: `"${key}" IS NULL`, params: [] };
  }
  if (rawValue === 'not.is.null') {
    return { clause: `"${key}" IS NOT NULL`, params: [] };
  }

  const dotIdx = rawValue.indexOf('.');
  if (dotIdx === -1) {
    return { op: '=', val: rawValue, col: key };
  }

  const op = rawValue.slice(0, dotIdx);
  let val = rawValue.slice(dotIdx + 1);

  switch (op) {
    case 'eq':
      return { op: '=', val, col: key };
    case 'neq':
      return { op: '!=', val, col: key };
    case 'gt':
      return { op: '>', val, col: key };
    case 'gte':
      return { op: '>=', val, col: key };
    case 'lt':
      return { op: '<', val, col: key };
    case 'lte':
      return { op: '<=', val, col: key };
    case 'like':
      val = val.replace(/\*/g, '%');
      return { op: 'LIKE', val, col: key };
    case 'ilike':
      val = val.replace(/\*/g, '%');
      return { op: 'ILIKE', val, col: key };
    case 'in':
      if (val.startsWith('(') && val.endsWith(')')) {
        const items = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        return { op: '= ANY', val: items, col: key, isArray: true };
      }
      return { op: '=', val, col: key };
    default:
      return { op: '=', val, col: key };
  }
}

function buildWhereConditions(queryParams, startParamIndex = 1) {
  const whereClauses = [];
  const values = [];
  let pIndex = startParamIndex;

  for (const [key, val] of Object.entries(queryParams)) {
    if (['select', 'order', 'limit', 'offset', 'apikey', 'on_conflict'].includes(key)) continue;

    if (key === 'or') {
      let orStr = typeof val === 'string' ? val.trim() : '';
      if (orStr.startsWith('(') && orStr.endsWith(')')) {
        orStr = orStr.slice(1, -1);
      }
      const parts = orStr.split(',').map(p => p.trim()).filter(Boolean);
      const orClauses = [];
      for (const part of parts) {
        const firstDot = part.indexOf('.');
        if (firstDot === -1) continue;
        const col = part.slice(0, firstDot);
        const rest = part.slice(firstDot + 1);
        const filter = parseFilter(col, rest);
        if (filter) {
          if (filter.clause) {
            orClauses.push(filter.clause);
          } else {
            orClauses.push(`"${filter.col}" ${filter.op} $${pIndex}`);
            values.push(filter.val);
            pIndex++;
          }
        }
      }
      if (orClauses.length > 0) {
        whereClauses.push(`(${orClauses.join(' OR ')})`);
      }
      continue;
    }

    const filter = parseFilter(key, val);
    if (!filter) continue;

    if (filter.clause) {
      whereClauses.push(filter.clause);
    } else if (filter.isArray) {
      whereClauses.push(`"${filter.col}" ${filter.op} ($${pIndex}::text[])`);
      values.push(filter.val);
      pIndex++;
    } else {
      whereClauses.push(`"${filter.col}" ${filter.op} $${pIndex}`);
      values.push(filter.val);
      pIndex++;
    }
  }

  return { whereClauses, values, nextParamIndex: pIndex };
}

function parseSelectColumns(selectParam) {
  if (!selectParam || selectParam === '*') return '*';

  const parts = selectParam.split(',').map(p => p.trim());
  const validCols = parts
    .filter(p => /^[a-zA-Z0-9_]+$/.test(p))
    .map(p => `"${p}"`);

  return validCols.length > 0 ? validCols.join(', ') : '*';
}

function parseOrderBy(orderParam) {
  if (!orderParam) return '';
  const parts = orderParam.split(',').map(p => p.trim());
  const orderClauses = [];

  for (const part of parts) {
    const [col, dir] = part.split('.');
    if (/^[a-zA-Z0-9_]+$/.test(col)) {
      const direction = (dir && dir.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
      orderClauses.push(`"${col}" ${direction}`);
    }
  }

  return orderClauses.length > 0 ? ` ORDER BY ${orderClauses.join(', ')}` : '';
}

function normalizeColumnValue(tableName, colName, value) {
  if (value === undefined) return null;
  if (value === null) return null;

  const isJsonCol = jsonColumnsCache.has(`${tableName}.${colName}`);
  if (isJsonCol && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
}

// Servidor API HTTP nativo conectado a PostgreSQL
const server = http.createServer(async (req, res) => {
  metrics.totalRequests++;
  metrics.activeConnections++;
  const start = Date.now();

  // CORS Headers universales
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Range, Content-Type, Content-Length');

  if (req.method === 'OPTIONS') {
    metrics.activeConnections--;
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  // Endpoint de salud y diagnóstico
  if (pathname === '/' || pathname === '/health' || pathname === '/api/health' || pathname === '/api') {
    metrics.activeConnections--;
    try {
      await pool.query('SELECT 1');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        engine: 'SICE-CBA Native Local PostgreSQL 16 Engine',
        uptimeSeconds: Math.round((Date.now() - metrics.startTime) / 1000),
        database: 'Connected (PostgreSQL 16.6 Local)',
        metrics: {
          totalRequests: metrics.totalRequests,
          successfulRequests: metrics.successfulRequests,
          errorRequests: metrics.errorRequests,
          activeConnections: metrics.activeConnections,
          avgLatencyMs: metrics.latencies.length > 0 
            ? (metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length).toFixed(2)
            : '0.00'
        }
      }, null, 2));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', error: e.message }));
    }
    return;
  }

  // Enrutamiento /api/:table o /rest/v1/:table
  let prefix = null;
  if (pathname.startsWith('/api/')) prefix = '/api/';
  else if (pathname.startsWith('/rest/v1/')) prefix = '/rest/v1/';

  if (!prefix) {
    metrics.activeConnections--;
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    return;
  }

  const tableName = pathname.replace(prefix, '').split('/')[0];
  if (!tableName || !/^[a-zA-Z0-9_]+$/.test(tableName)) {
    metrics.activeConnections--;
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Nombre de tabla inválido' }));
    return;
  }

  // Leer cuerpo de la petición
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', async () => {
    let body = null;
    if (chunks.length > 0) {
      const rawBody = Buffer.concat(chunks).toString('utf-8');
      if (rawBody.trim()) {
        try {
          body = JSON.parse(rawBody);
        } catch {
          metrics.activeConnections--;
          metrics.errorRequests++;
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'JSON inválido en el cuerpo de la petición' }));
          return;
        }
      }
    }

    const queryParams = parsedUrl.query;
    const acceptHeader = req.headers['accept'] || '';
    const preferHeader = req.headers['prefer'] || '';
    const isSingle = acceptHeader.includes('application/vnd.pgrst.object+json');
    const isUpsert = preferHeader.includes('resolution=merge-duplicates') || req.method === 'POST';
    const isReturnMinimal = preferHeader.includes('return=minimal');

    try {
      let responseData = null;
      let statusCode = 200;

      // --- 1. GET / HEAD (Lectura) ---
      if (req.method === 'GET' || req.method === 'HEAD') {
        const selectCols = parseSelectColumns(queryParams.select);
        const { whereClauses, values } = buildWhereConditions(queryParams, 1);

        let sql = `SELECT ${selectCols} FROM "${tableName}"`;
        if (whereClauses.length > 0) {
          sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        sql += parseOrderBy(queryParams.order);

        if (queryParams.limit) {
          sql += ` LIMIT ${parseInt(queryParams.limit, 10)}`;
        }
        if (queryParams.offset) {
          sql += ` OFFSET ${parseInt(queryParams.offset, 10)}`;
        }

        const dbRes = await pool.query(sql, values);

        if (req.method === 'HEAD') {
          statusCode = 200;
          responseData = null;
        } else if (isSingle) {
          if (dbRes.rows.length === 0) {
            statusCode = 406;
            responseData = { message: 'Registro no encontrado' };
          } else {
            responseData = dbRes.rows[0];
          }
        } else {
          responseData = dbRes.rows;
        }
      }

      // --- 2. POST (Inserción o Upsert) ---
      else if (req.method === 'POST') {
        const records = Array.isArray(body) ? body : [body];
        if (records.length === 0 || !records[0]) {
          statusCode = 400;
          responseData = { error: 'Payload vacío para inserción' };
        } else {
          const insertedRows = [];
          const pkCol = primaryKeysCache.get(tableName) || (records[0]?.id !== undefined ? 'id' : (records[0]?.user_id !== undefined ? 'user_id' : null));
          const conflictCol = queryParams.on_conflict || pkCol;

          for (const record of records) {
            const keys = Object.keys(record);
            const vals = keys.map(k => normalizeColumnValue(tableName, k, record[k]));
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const colNames = keys.map(k => `"${k}"`).join(', ');

            let insertSql = `INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders})`;

            if (isUpsert && conflictCol && keys.includes(conflictCol)) {
              const updateCols = keys
                .filter(k => k !== conflictCol)
                .map(k => `"${k}" = EXCLUDED."${k}"`)
                .join(', ');

              if (updateCols) {
                insertSql += ` ON CONFLICT ("${conflictCol}") DO UPDATE SET ${updateCols}`;
              } else {
                insertSql += ` ON CONFLICT ("${conflictCol}") DO NOTHING`;
              }
            }

            insertSql += ` RETURNING *`;

            const r = await pool.query(insertSql, vals);
            if (r.rows[0]) insertedRows.push(r.rows[0]);
          }

          statusCode = 201;
          if (isReturnMinimal) {
            responseData = null;
          } else {
            responseData = Array.isArray(body) ? insertedRows : (insertedRows[0] || {});
          }
        }
      }

      // --- 3. PATCH (Actualización) ---
      else if (req.method === 'PATCH') {
        const keys = Object.keys(body || {});
        if (keys.length === 0) {
          statusCode = 400;
          responseData = { error: 'No fields to update' };
        } else {
          let pIdx = 1;
          const setClauses = [];
          const vals = [];

          for (const k of keys) {
            setClauses.push(`"${k}" = $${pIdx++}`);
            vals.push(normalizeColumnValue(tableName, k, body[k]));
          }

          const { whereClauses, values: whereValues } = buildWhereConditions(queryParams, pIdx);
          vals.push(...whereValues);

          let updateSql = `UPDATE "${tableName}" SET ${setClauses.join(', ')}`;
          if (whereClauses.length > 0) {
            updateSql += ` WHERE ${whereClauses.join(' AND ')}`;
          }
          updateSql += ` RETURNING *`;

          const r = await pool.query(updateSql, vals);
          statusCode = 200;
          if (isReturnMinimal) {
            responseData = null;
          } else {
            responseData = isSingle ? (r.rows[0] || null) : r.rows;
          }
        }
      }

      // --- 4. DELETE (Eliminación) ---
      else if (req.method === 'DELETE') {
        const { whereClauses, values } = buildWhereConditions(queryParams, 1);

        let delSql = `DELETE FROM "${tableName}"`;
        if (whereClauses.length > 0) {
          delSql += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        delSql += ` RETURNING *`;

        const r = await pool.query(delSql, values);
        statusCode = 200;
        responseData = isReturnMinimal ? null : r.rows;
      }

      else {
        statusCode = 405;
        responseData = { error: `Método ${req.method} no permitido` };
      }

      // Respuesta al cliente
      const duration = Date.now() - start;
      metrics.latencies.push(duration);
      if (metrics.latencies.length > 5000) metrics.latencies.shift();
      if (statusCode < 400) metrics.successfulRequests++;
      else metrics.errorRequests++;
      metrics.activeConnections--;

      if (req.method === 'HEAD' || (statusCode === 204 && responseData === null)) {
        res.writeHead(statusCode);
        res.end();
      } else {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(responseData !== null ? JSON.stringify(responseData) : '');
      }

    } catch (err) {
      metrics.activeConnections--;
      metrics.errorRequests++;
      console.error(`[API DB Error ${req.method} ${tableName}]:`, err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message, code: err.code }));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Servidor API Local SICE-CBA activo en http://127.0.0.1:${PORT}`);
  console.log(`🐘 Conectado directamente a PostgreSQL local en ${PG_CONN_STRING}`);
});

export default server;
