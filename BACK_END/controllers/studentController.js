import { findAllStudents, createStudent } from '@/models/studentModel';
import { getRelationships } from '@/models/studentsModel';

// GET /api/students
export async function getStudents() {
  const students = await findAllStudents();
  return students;
}

// POST /api/students
export async function storeStudent(body) {
  const { student_code, first_name, last_name, gender } = body;

  if (!student_code || !first_name || !last_name || !gender) {
    throw new Error('กรอกข้อมูลไม่ครบ');
  }

  await createStudent(body);
}

export async function fetchRelationships() {
  const data = await getRelationships();
  return data;
}

/*import { findAllStudents } from '../models/studentModel';

export async function getStudents() {
  return await findAllStudents();
}*/