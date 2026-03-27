// app/api/dorms/route.js
import { DormController } from '@/controllers/dormController';

// GET /api/dorms
export async function GET() {
  try {
    const data = await DormController.getAll();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'โหลดข้อมูลหอพักไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

// POST /api/dorms
export async function POST(req) {
  try {
    const body = await req.json();
    await DormController.create(body);
    return Response.json({ message: 'เพิ่มหอพักสำเร็จ' });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'เพิ่มหอพักไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

// PUT /api/dorms
export async function PUT(req) {
  try {
    const { dorm_id, ...data } = await req.json();
    await DormController.update(dorm_id, data);
    return Response.json({ message: 'แก้ไขหอพักสำเร็จ' });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'แก้ไขหอพักไม่สำเร็จ' },
      { status: 500 }
    );
  }
}
