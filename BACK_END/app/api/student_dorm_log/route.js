// app/api/student_dorm_log/route.js
import {
  getStudentsDormLog,
  registerStudentDorm
} from '@/controllers/students_dorm_logController';

export async function GET() {
  const data = await getStudentsDormLog();
  return Response.json(data);
}

// ✅ POST
export async function POST(req) {
  try {
    const body = await req.json();
    await registerStudentDorm(body);

    return Response.json({
      message: 'ลงทะเบียนเข้าหอพักสำเร็จ'
    });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
