"use client";

import { useEffect, useState } from "react";
import { getImovelById } from "@/app/_actions/imoveis";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ArrowDown, Captions, ChevronLeft, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UploadImovelImagem from "@/app/_components/upload-imovel-imagem";
import { ImovelComImagens } from "@/app/_types/estoque";

interface ImovelPageProps {
  params: { id: string };
}

export default function ImovelPage({ params }: ImovelPageProps) {
  const { id } = params;
  const [imovel, setImovel] = useState<ImovelComImagens | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  async function fetchImovel() {
    const data = await getImovelById(id);
    setImovel(data as ImovelComImagens);
    if (data?.imagens?.length) {
      setMainImage(data.imagens[0].url);
    } else {
      setMainImage("/sem-foto.png"); // fallback padrão
    }
  }

  useEffect(() => {
    fetchImovel();
  }, []);

  if (!imovel) return <div className="text-center text-gray-300 mt-10">Carregando...</div>;

  return (
    <div className="relative">
      <Link href="/imoveis" className="absolute top-3 left-4">
        <ChevronLeft className="w-8 h-8" />
      </Link>

      <header className="flex flex-col justify-center items-center my-2 gap-2">
        <h2 className="text-2xl font-bold text-gray-200 my-4">Detalhes do Imóvel</h2>
      </header>

      {/* imagem principal */}
      <div className="relative w-full h-[30vh] aspect-video">
        <Image
          src={mainImage || "/sem-foto.png"}
          alt="Imagem do imóvel"
          fill
          className="object-cover object-center rounded-md"
          priority
        />
        <div className="absolute inset-0 bg-black/20 flex items-end justify-center">
          <h1 className="text-white text-2xl font-bold mb-4 px-2 opacity-90">
            {imovel?.endereco}
          </h1>
        </div>

      </div>

      <div className="my-2">
        <UploadImovelImagem imovelId={id} onUploaded={() => fetchImovel()} />
      </div>

      {/* miniaturas clicáveis */}
      {imovel.imagens?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 mt-4 pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {imovel.imagens.map((img: any) => (
            <div
              key={img.id}
              className={`relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer ${mainImage === img.url ? "border-primary" : "border-transparent"
                }`}
              onClick={() => setMainImage(img.url)}
            >
              <Image src={img.url} alt="Miniatura" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* informações gerais */}
      <div className="px-4 mt-5">
        <Card className="my-3">
          <CardContent className="p-5">
            <CardHeader className="flex-row items-center gap-4 p-0">
              <Captions className="text-primary w-8 h-8" />
              <h3 className="text-white text-lg font-semibold">Visão Geral do Imóvel</h3>
            </CardHeader>
            <p className="text-sm text-gray-400 mt-4">
              {imovel.descricao}
            </p>
          </CardContent>
        </Card>

        <Card className="my-3">
          <CardContent className="px-5 flex justify-between items-center">
            <p className="text-sm text-gray-400 mt-4">Status da reforma</p>
            <Badge className="mt-auto">{imovel?.status}</Badge>
          </CardContent>
        </Card>

        <Card className="my-3">
          <CardContent className="p-5">
            <CardHeader className="flex-row items-center gap-4 p-0">
              <FileText className="text-primary w-8 h-8" />
              <h3 className="text-white text-lg font-semibold">Documentação</h3>
            </CardHeader>
            <p className="text-sm text-gray-400 mt-4">
              Disponível para download: Contrato de Compra e Venda, Planta Baixa, Memorial Descritivo.
            </p>
            <Button className="mt-4" variant="secondary">
              <ArrowDown /> Baixar Documentação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
