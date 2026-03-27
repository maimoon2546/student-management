const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const DormExitService = {
  getStudent: async (student_code) => {
    const res = await fetch(`${API_URL}/api/dorm-exit/student/${student_code}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  },

  exitDorm: async (data) => {
    const res = await fetch(`${API_URL}/api/dorm-exit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result;
  }
};