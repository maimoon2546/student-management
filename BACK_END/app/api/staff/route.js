import pool from '@/lib/db';

export async function GET() {
  const [rows] = await pool.execute(`
    SELECT 
     staff_id,
     username,
     first_name,
     last_name,
     password,
     role,
     last_login
    FROM staff
  `);

  return Response.json(rows);
}
