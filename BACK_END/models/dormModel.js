// models/dormModel.js
import pool from '@/lib/db';

export const DormModel = {
  getAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM dorms`);
    return rows;
  },

  create: async ({ dorm_name, description, total_room, total_floor }) => {
    await pool.query(
      `INSERT INTO dorms (dorm_name, description, total_room, total_floor) VALUES (?, ?, ?, ?)`,
      [dorm_name, description, total_room, total_floor]
    );
  },

  update: async (id, { dorm_name, description, status }) => {
    await pool.query(
      `UPDATE dorms 
       SET dorm_name = ?, description = ?, status = ?
       WHERE dorm_id = ?`,
      [dorm_name, description, status, id]
    );
  }
};
