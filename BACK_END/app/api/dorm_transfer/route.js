import { transferStudentDorm } from '@/controllers/dorm_transferController';

export async function PUT(req) {
  return transferStudentDorm(req);
}