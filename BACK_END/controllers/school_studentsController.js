import db from '@/lib/db';
import { createStudent, updateStudentRelation } from '@/models/studentModel';
import { insertParent } from '@/models/parentsModel';

export async function createWithParent(data) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const { student, parent } = data;

    if (!student?.student_code) {
      throw new Error('กรุณากดสร้างรหัสนักเรียนก่อน');
    }

    // 1) INSERT students
    await createStudent(conn, {
      ...student,
      student_status: student.student_status || 'Active'
    });

    // 2) INSERT parents
    let parent_id = null;
    if (parent?.first_name) {
      parent_id = await insertParent(conn, parent);

      // สร้าง relationship อัตโนมัติจาก gender
      let relationship = null;
      if (parent.gender === 'ชาย') relationship = 'บิดา';
      if (parent.gender === 'หญิง') relationship = 'มารดา';

      // 3) UPDATE students
      await updateStudentRelation(conn, {
        student_code: student.student_code,
        parent_id,
        relationship
      });
    }

    await conn.commit();
    return { student_code: student.student_code };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}