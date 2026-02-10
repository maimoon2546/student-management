// controllers/roomController.js
import { RoomModel } from '@/models/roomModel';

export const RoomController = {
  getByDorm: async (dorm_id) => RoomModel.getByDorm(dorm_id),
  create: async (data) => RoomModel.create(data),
  update: async (id, data) => RoomModel.update(id, data),
};
