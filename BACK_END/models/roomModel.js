// models/roomModel.js
import pool from '@/lib/db';

export const RoomModel = {

  // ดึงห้องที่ยังว่างในหอ
  getByDorm: async (dorm_id) => {
    const [rows] = await pool.query(
      `SELECT
        room_id,
        dorm_id,
        room_number,
        capacity,
        IFNULL(current_occupancy,0) AS current_occupancy,
        (capacity - IFNULL(current_occupancy,0)) AS remaining,
        description
       FROM rooms
       WHERE dorm_id = ?
       AND IFNULL(current_occupancy,0) < capacity
       ORDER BY room_number ASC`,
      [dorm_id]
    );
    return rows;
  },

  // ตรวจสอบว่าห้องเต็มหรือยัง
  checkRoomAvailable: async (room_id) => {
    const [rows] = await pool.query(
      `SELECT capacity, IFNULL(current_occupancy,0) AS current_occupancy
       FROM rooms
       WHERE room_id = ?`,
      [room_id]
    );

    if (!rows.length) throw new Error("ไม่พบห้อง");

    if (rows[0].current_occupancy >= rows[0].capacity) {
      throw new Error("ห้องเต็มแล้ว");
    }

    return rows[0]; // ส่งข้อมูลห้องกลับไปใช้ต่อได้
  },

  // เพิ่มจำนวนคนในห้อง
  increaseOccupancy: async (room_id) => {
    await pool.query(
      `UPDATE rooms
       SET current_occupancy = IFNULL(current_occupancy,0) + 1
       WHERE room_id = ?
       AND IFNULL(current_occupancy,0) < capacity`,
      [room_id]
    );
  },

  // ลดจำนวนคนในห้อง (ตอนลบนักเรียน / ย้ายออก)
  decreaseOccupancy: async (room_id) => {
    await pool.query(
      `UPDATE rooms
       SET current_occupancy = CASE
         WHEN IFNULL(current_occupancy,0) > 0
         THEN current_occupancy - 1
         ELSE 0
       END
       WHERE room_id = ?`,
      [room_id]
    );
  },

  // สร้างห้องใหม่
  create: async ({ dorm_id, room_number, capacity, description }) => {
    await pool.query(
      `INSERT INTO rooms (dorm_id, room_number, capacity, current_occupancy, description)
       VALUES (?, ?, ?, 0, ?)`,
      [dorm_id, room_number, capacity, description]
    );
  },

  // แก้ไขห้อง
  update: async (id, { room_number, capacity, description, status }) => {
    await pool.query(
      `UPDATE rooms
       SET room_number = ?, capacity = ?, description = ?, status = ?
       WHERE room_id = ?`,
      [room_number, capacity, description, status, id]
    );
  }

};
