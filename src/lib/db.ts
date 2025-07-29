
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool() {
  if (pool) {
    return pool;
  }
  
  // Verify that all required environment variables are set
  if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_DATABASE) {
    console.error("Missing database environment variables. Please check your .env file.");
    // Return a dummy object to prevent crashing, but queries will fail.
    return {
      execute: () => Promise.reject(new Error("Database configuration is missing.")),
      getConnection: () => Promise.reject(new Error("Database configuration is missing.")),
    } as unknown as mysql.Pool;
  }
  
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}


// A helper function to execute queries
export async function query(sql: string, params: any[]) {
    const connectionPool = getPool();
    try {
        const [rows] = await connectionPool.execute(sql, params);
        return rows;
    } catch (error) {
        // Log the detailed error on the server and re-throw it
        console.error("Database Query Error:", error);
        throw error;
    }
}
