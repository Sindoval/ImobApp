import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { db } from "@/app/_lib/prisma";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imagemId = searchParams.get("id");

    if (!imagemId) {
      return NextResponse.json({ error: "Imagem não informada" }, { status: 400 });
    }

    // Busca imagem no banco pra ter o public_id
    const imagem = await db.imovelImagem.findUnique({ where: { id: imagemId } });
    if (!imagem) {
      return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
    }

    // Extrai o public_id da URL do Cloudinary
    // Exemplo: https://res.cloudinary.com/.../imoveis/abc/def.jpg -> imoveis/abc/def
    const { publicId } = imagem;

    // Deleta do Cloudinary
    await cloudinary.v2.uploader.destroy(publicId);

    // Deleta do banco
    await db.imovelImagem.delete({ where: { id: imagemId } });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Erro ao deletar imagem:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
