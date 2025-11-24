import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { endereco, descricao, valorCompra, valorVenda, status, engenheiroId } = await req.json();

  try {
    const imovel = await db.imovel.create({
      data: {
        endereco,
        descricao,
        valorCompra,
        valorVenda,
        status,
        engenheiroId,
      }
    });
    const imovelFolder = `imoveis/${imovel.id}`;
    const fotosFolder = `imoveis/${imovel.id}/fotos`;
    const docsFolder = `imoveis/${imovel.id}/documentos`;

    await cloudinary.v2.api.create_folder(imovelFolder);
    await cloudinary.v2.api.create_folder(fotosFolder);
    await cloudinary.v2.api.create_folder(docsFolder);

    revalidatePath("/imoveis");
    return NextResponse.json({ imovel }, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
