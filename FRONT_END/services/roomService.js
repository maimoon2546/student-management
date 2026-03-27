// services/roomService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRoomsByDorm(dorm_id) {
  const res = await fetch(`${API_URL}/api/rooms?dorm_id=${dorm_id}`);
  if (!res.ok) {
    throw new Error('โหลดข้อมูลห้องไม่สำเร็จ');
  }
  return res.json();
}

export const RoomService = {
  getByDorm: async (dorm_id) => {
    const res = await fetch(`${API_URL}/api/rooms?dorm_id=${dorm_id}`);
    return res.json();
  },

  create: async (data) => {
    return fetch(`${API_URL}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  update: async (data) => {
    return fetch(`${API_URL}/api/rooms`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};