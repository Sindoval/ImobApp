import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";

export async function POST(req: Request) {
  try {
    const { imovelId } = await req.json();

    if (!imovelId) {
      return NextResponse.json({ ok: false, error: "ID inválido" });
    }

    const documentos = await db.documento.findMany({ where: { imovelId } });

    for (const doc of documentos) {
      const head = await fetch(doc.url, { method: "HEAD" });

      // Se estiver deletado do Cloudinary → remove do banco
      if (!head.ok) {
        await db.documento.delete({ where: { id: doc.id } });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Erro ao sincronizar" });
  }
}
