import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function query<T = unknown>(sql: string, params: unknown[] = []) {
  const connection = await getPool().getConnection();

  try {
    const [rows] = await connection.query(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

export async function execute(sql: string, params: unknown[] = []) {
  const connection = await getPool().getConnection();

  try {
    const [result] = await connection.query(sql, params);
    return result;
  } finally {
    connection.release();
  }
}
