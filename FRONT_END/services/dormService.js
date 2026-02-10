const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllDorms() {
  const res = await fetch(`${API_URL}/api/dorms`);
  if (!res.ok) {
    throw new Error('โหลดข้อมูลหอพักไม่สำเร็จ');
  }
  return res.json();
}

export const DormService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/api/dorms`);
    return res.json();
  },

  create: async (data) => {
    return fetch(`${API_URL}/api/dorms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  update: async (data) => {
    return fetch(`${API_URL}/api/dorms`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};