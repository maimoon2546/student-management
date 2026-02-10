import mysql from "mysql2/promise";

async function test() {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "student_management",
    port: 3306,
  });

  const [rows] = await conn.query("SHOW TABLES");
  console.log(rows);
  process.exit();
}

test();
