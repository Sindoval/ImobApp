import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { db } from "@/app/_lib/prisma";

export const runtime = "nodejs";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function ensureFolderExists(folder: string) {
  try {
    await cloudinary.v2.search
      .expression(`folder="${folder}"`)
      .max_results(1)
      .execute();
    return true; // pasta existe
  } catch (err: any) {
    if (err.error?.http_code === 404 || err.error?.message?.includes("not found")) {
      await cloudinary.v2.api.create_folder(folder);
      return true; // criada
    }
    throw err; // outro erro
  }
}

async function uploadToCloudinary(buffer: Buffer, folder: string, filename?: string) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
        overwrite: false,
        resource_type: "auto", // para suportar imagens e pdfs
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as any);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const imovelId = formData.get("imovelId") as string | null;

    if (!file || !imovelId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // 📌 Determina pasta (foto ou documento)
    const baseFolder = `imoveis/${imovelId}`;
    const folder =
      file.type.startsWith("image/")
        ? `${baseFolder}/fotos`
        : `${baseFolder}/documentos`;

    // 📁 Garante que as pastas existem
    await ensureFolderExists(baseFolder);
    await ensureFolderExists(`${baseFolder}/fotos`);
    await ensureFolderExists(`${baseFolder}/documentos`);

    // arquivo → buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadToCloudinary(buffer, folder);

    const img = await db.imovelImagem.create({
      data: {
        imovelId,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        descricao: null,
      },
    });

    return NextResponse.json({ ok: true, img });
  } catch (err: any) {
    console.error("Erro upload imagem:", err);
    return NextResponse.json({ error: err.message || "Erro interno" }, { status: 500 });
  }
}
