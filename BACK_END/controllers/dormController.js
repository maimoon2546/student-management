// controllers/dormController.js
import { DormModel } from '@/models/dormModel';

export const DormController = {
  getAll: async () => DormModel.getAll(),
  create: async (data) => DormModel.create(data),
  update: async (id, data) => DormModel.update(id, data),
};
