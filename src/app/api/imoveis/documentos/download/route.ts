import { NextResponse } from "next/server";
import JSZip from "jszip";
import { db } from "@/app/_lib/prisma";

export const runtime = "nodejs"; // IMPORTANTE: precisamos do Node runtime para usar Buffer/node streams

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const docs = await db.documento.findMany({
      where: { imovelId: id },
    });

    if (!docs || docs.length === 0)
      return NextResponse.json({ error: "Nenhum documento encontrado" }, { status: 404 });

    const zip = new JSZip();

    // Baixa cada documento remoto e adiciona ao ZIP
    for (const doc of docs) {
      try {
        const fileRes = await fetch(doc.url);
        if (!fileRes.ok) {
          console.warn(`Falha ao baixar ${doc.url}: ${fileRes.status}`);
          continue; // pula arquivo problemático
        }

        const arrayBuf = await fileRes.arrayBuffer();
        // JSZip aceita ArrayBuffer direto ao adicionar arquivo
        zip.file(doc.nome, arrayBuf);
      } catch (err) {
        console.warn(`Erro ao processar documento ${doc.url}:`, err);
        // opcional: continuar com os demais arquivos
      }
    }

    // Gera um Buffer (node) em vez de uint8array para compatibilidade com Response no Node
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Retorna o Buffer como arquivo para download
    return new Response(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="documentos-${id}.zip"`,
        "Content-Length": String(zipBuffer.length),
      },
    });
  } catch (err) {
    console.error("Erro ao gerar ZIP:", err);
    return NextResponse.json({ error: "Erro ao gerar ZIP" }, { status: 500 });
  }
}
