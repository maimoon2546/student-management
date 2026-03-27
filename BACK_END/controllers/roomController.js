// controllers/roomController.js
import { RoomModel } from '@/models/roomModel';

export const RoomController = {

  // ดึงห้องที่ยังว่าง
  getByDorm: async (dorm_id) => {
    return await RoomModel.getByDorm(dorm_id);
  },

  // สร้างห้อง
  create: async (data) => {
    return await RoomModel.create(data);
  },

  // แก้ไขห้อง
  update: async (id, data) => {
    return await RoomModel.update(id, data);
  },

  // ตรวจสอบห้องว่างก่อนเลือก
  checkRoomAvailable: async (room_id) => {
    return await RoomModel.checkRoomAvailable(room_id);
  },

  // เพิ่มจำนวนคนในห้อง (ตอนเพิ่มนักเรียน)
  increaseOccupancy: async (room_id) => {
    return await RoomModel.increaseOccupancy(room_id);
  },

  // ลดจำนวนคนในห้อง (ตอนย้ายออก / ลบ)
  decreaseOccupancy: async (room_id) => {
    return await RoomModel.decreaseOccupancy(room_id);
  }

};
