import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";

export const runtime = "nodejs"; // GARANTE acesso ao process.env

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const imovelId = form.get("imovelId") as string;

    if (!file || !imovelId) {
      return NextResponse.json({ ok: false, error: "Dados inválidos" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = `imoveis/${imovelId}/documentos`;

    // Cria pasta caso não exista (ignorar erro 409 se já existir)
    try {
      await cloudinary.api.create_folder(folder);
    } catch (err: any) {
      if (err.http_code !== 409) throw err;
    }

    // 🔥 Wrappa upload_stream em uma Promise
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "raw", // pdf, doc, zip, etc
          public_id: file.name.replace(/\.[^/.]+$/, ""), // nome sem extensão
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );

      stream.end(buffer);
    });

    // Salva no banco
    await db.documento.create({
      data: {
        imovelId,
        nome: file.name,
        url: result.secure_url,
      },
    });

    return NextResponse.json({ ok: true, url: result.secure_url });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Erro no upload" });
  }
}
