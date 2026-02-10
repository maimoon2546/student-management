// models/roomModel.js
import pool from '@/lib/db';

export const RoomModel = {
  getByDorm: async (dorm_id) => {
    const [rows] = await pool.query(
      `SELECT
        room_id,
        dorm_id,
        room_number,
        capacity,
        current_occupancy,
        status,
        description
       FROM rooms
       WHERE dorm_id = ?
       ORDER BY room_number ASC`,
      [dorm_id]
    );
    return rows;
  },

  create: async ({ dorm_id, room_number, capacity, description }) => {
    await pool.query(
      `INSERT INTO rooms (dorm_id, room_number, capacity, description)
       VALUES (?, ?, ?, ?)`,
      [dorm_id, room_number, capacity, description]
    );
  },

  update: async (id, { room_number, capacity, description, status }) => {
    await pool.query(
      `UPDATE rooms
       SET room_number = ?, capacity = ?, description = ?, status = ?
       WHERE room_id = ?`,
      [room_number, capacity, description, status, id]
    );
  }
};
