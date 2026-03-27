import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {

    const formData = await req.formData();
    const file = formData.get("file");
    const studentCode = formData.get("student_code");

    if (!file) {
      return Response.json({ message: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${studentCode}-${Date.now()}.jpg`;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    );

    await writeFile(uploadPath, buffer);

    return Response.json({
      path: `/uploads/${fileName}`
    });

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Upload error" }, { status: 500 });
  }
}