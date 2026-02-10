// models/parentsModel.js
export async function insertParent(conn, parent) {
  const { title, first_name, last_name, gender, phone, email, address } = parent;

  const [result] = await conn.query(
    `
    INSERT INTO parents
    (title, first_name, last_name, gender, phone, email, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [title, first_name, last_name, gender, phone, email, address]
  );

  return result.insertId;
}

/*export async function createParent(conn, data) {
  const {
    parent_title,
    parent_first_name,
    parent_last_name,
    parent_gender,
    phone,
    email,
    address,
  } = data;

  const [result] = await conn.query(
    `INSERT INTO parents
     (title, first_name, last_name, gender, phone, email, address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      parent_title,
      parent_first_name,
      parent_last_name,
      parent_gender,
      phone || null,
      email || null,
      address || null,
    ]
  );

  return result.insertId; // 🔑 สำคัญมาก
}

/*export async function createParent(conn, data) {
  const { first_name, last_name, phone, email, address } = data;

  const [result] = await conn.query(
    `INSERT INTO parents 
     (first_name, last_name, phone, email, address)
     VALUES (?, ?, ?, ?, ?)`,
    [first_name, last_name, phone, email, address]
  );

  return result.insertId; // parent_id
}*/
