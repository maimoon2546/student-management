import { NextResponse } from 'next/server';
import { DormExitModel } from '@/models/dormExitModel';

export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id, exit_date } = body;

    if (!student_id || !exit_date) {
      return NextResponse.json(
        { message: 'กรอกข้อมูลไม่ครบ' },
        { status: 400 }
      );
    }

    await DormExitModel.exitDorm({
      student_id,
      exit_date
    });

    return NextResponse.json({
      message: 'แจ้งย้ายออกสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}