// app/api/rooms/route.js
import { RoomController } from '@/controllers/roomController';

// GET /api/rooms?dorm_id=1
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dorm_id = searchParams.get('dorm_id');

    if (!dorm_id) {
      return Response.json(
        { message: 'กรุณาระบุ dorm_id' },
        { status: 400 }
      );
    }

    const data = await RoomController.getByDorm(dorm_id);
    return Response.json(data);

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'โหลดข้อมูลห้องไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

// POST /api/rooms
export async function POST(req) {
  try {
    const body = await req.json();
    await RoomController.create(body);
    return Response.json({ message: 'เพิ่มห้องสำเร็จ' });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'เพิ่มห้องไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

// PUT /api/rooms
export async function PUT(req) {
  try {
    const { room_id, ...data } = await req.json();
    await RoomController.update(room_id, data);
    return Response.json({ message: 'แก้ไขห้องสำเร็จ' });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'แก้ไขห้องไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

// ตรวจสอบห้องว่าง
export async function PATCH(req) {
  try {
    const { room_id, action } = await req.json();

    if (!room_id) {
      return Response.json(
        { message: 'กรุณาระบุ room_id' },
        { status: 400 }
      );
    }

    if (action === 'check') {
      const room = await RoomController.checkRoomAvailable(room_id);
      return Response.json(room);
    }

    if (action === 'increase') {
      await RoomController.increaseOccupancy(room_id);
      return Response.json({ message: 'เพิ่มจำนวนคนในห้องแล้ว' });
    }

    if (action === 'decrease') {
      await RoomController.decreaseOccupancy(room_id);
      return Response.json({ message: 'ลดจำนวนคนในห้องแล้ว' });
    }

    return Response.json(
      { message: 'action ไม่ถูกต้อง' },
      { status: 400 }
    );

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'อัปเดตจำนวนคนในห้องไม่สำเร็จ' },
      { status: 500 }
    );
  }
}
