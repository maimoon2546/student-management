// models/dormModel.js
import pool from '@/lib/db';

export const DormModel = {

  // =============================
  // ดึงข้อมูลหอพักทั้งหมด
  // =============================
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT * FROM dorms
    `);
    return rows;
  },

  // =============================
  // เพิ่มหอพักใหม่
  // =============================
  create: async ({ dorm_name, dorm_type, description, total_room, total_floor }) => {

    await pool.query(
      `INSERT INTO dorms 
      (dorm_name, dorm_type, description, total_room, total_floor) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        dorm_name,
        dorm_type,
        description,
        total_room,
        total_floor
      ]
    );
  },

  // =============================
  // แก้ไขข้อมูลหอพัก
  // =============================
  update: async (id, { dorm_name, dorm_type, description, status }) => {

    await pool.query(
      `UPDATE dorms 
       SET dorm_name = ?, dorm_type = ?, description = ?, status = ?
       WHERE dorm_id = ?`,
      [
        dorm_name,
        dorm_type,
        description,
        status,
        id
      ]
    );
  }
};