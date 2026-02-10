// controllers/school_studentsController.js
import db from '@/lib/db';
import { createStudent, updateStudentRelation } from '@/models/studentModel';
import { insertParent } from '@/models/parentsModel';

export async function createWithParent(data) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const { student, parent, relationship } = data;

    if (!student?.student_code) {
      throw new Error('กรุณากดสร้างรหัสนักเรียนก่อน');
    }

    // 1) INSERT students (ครั้งเดียว)
    await createStudent(conn, {
      ...student,
      status: 'in'
    });

    // 2) INSERT parents
    let parent_id = null;
    if (parent?.first_name) {
      parent_id = await insertParent(conn, parent);

      // 3) UPDATE students (ใส่ parent + relationship)
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

/*export async function createWithParent(conn, data) {
  if (!data?.student?.student_code) {
    throw new Error('กรุณากดสร้างรหัสนักเรียนก่อน');
  }

  const { student, parent, relationship } = data;

  await insertSchoolStudent(conn, {
    student_code: student.student_code,
    title: student.title,
    first_name: student.first_name,
    last_name: student.last_name,
    gender: student.gender,
    birth_date: student.birth_date,
    status: 'in'
  });

  if (parent?.first_name) {
    const parent_id = await insertParent(conn, parent);

    await insertStudentRelation(conn, {
      student_code: student.student_code,
      parent_id,
      relationship
    });
  }

  return student.student_code;
}

/*export async function createWithParent(data) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    console.log('CONTROLLER DATA:', data);

    const { student, parent, relationship } = data;

    if (!student?.student_code) {
      throw new Error('student_code is missing');
    }

    await insertSchoolStudent(conn, student);

    const parent_id = await insertParent(conn, {
      title: parent.title,
      first_name: parent.firstName,
      last_name: parent.lastName,
      gender: parent.gender,
      phone: parent.phone,
      email: parent.email,
      address: parent.address
    });

    await insertStudentRelation(conn, {
      student_code: student.student_code,
      parent_id,
      relationship,
      status: 'out',
      path: student.path,
      qr_code: student.qr_code
    });

    await conn.commit();

    return Response.json({ message: 'บันทึกข้อมูลสำเร็จ' });

  } catch (err) {
    await conn.rollback();
    console.error('REGISTER ERROR:', err); // 🔴 สำคัญ
    return Response.json({ message: err.message }, { status: 500 });
  } finally {
    conn.release();
  }
}*/

/*import {
  findStudyingStudents,
  createSchoolStudent
} from '@/models/school_studentsModel';

// GET
/*export async function getSchool_Students() {
  return await findStudyingStudents();
}

// POST
export async function storeSchool_Students(data) {
  if (
    !data.student_code ||
    !data.title ||
    !data.first_name ||
    !data.last_name ||
    !data.gender ||
    !data.birth_date
  ) {
    throw new Error('กรอกข้อมูลไม่ครบ');
  }

  await createSchoolStudent(data);
}*/
