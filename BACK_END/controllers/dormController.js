// controllers/dormController.js
import { DormModel } from '@/models/dormModel';

export const DormController = {

  // ดึงหอพักทั้งหมด
  getAll: async () => {
    return await DormModel.getAll();
  },

  // สร้างหอพัก
  create: async (data) => {

    if (!data.dorm_type) {
      throw new Error("กรุณาเลือกประเภทหอพัก");
    }

    if (!["ชาย", "หญิง"].includes(data.dorm_type)) {
      throw new Error("ประเภทหอพักไม่ถูกต้อง");
    }

    return await DormModel.create(data);
  },

  // แก้ไขหอพัก
  update: async (id, data) => {

    if (data.dorm_type && !["ชาย", "หญิง"].includes(data.dorm_type)) {
      throw new Error("ประเภทหอพักไม่ถูกต้อง");
    }

    return await DormModel.update(id, data);
  }
};