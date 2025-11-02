import { getImovelById } from "@/app/_actions/imoveis";
import MaterialsButton from "@/app/_components/materialsButton";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ArrowDown, BrickWall, Captions, ChevronLeft, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ImovelPageProps {
  params: {
    id: string
  }
}

const ImovelPage = async ({ params }: ImovelPageProps) => {
  const { id } = params;
  const imovel = await getImovelById(id);

  return (
    <div className="relative">
      <Link href="/imoveis" className="absolute top-3 left-4">
        <ChevronLeft className="w-8 h-8"/>
      </Link>
     <header className="flex justify-center my-2">
        <h2 className="text-2xl font-bold text-gray-200 my-4">Detalhes do Imóvel</h2>
      </header>

      <div className="relative w-full h-[30vh] aspect-video">
        <Image
          src="/imovel.jpg"
          alt="imagem imóvel"
          fill
          className="object-cover object-center rounded-md"
          priority
        />
        {/* Sombra e texto sobre a imagem */}
        <div className="absolute inset-0 bg-black/20 flex items-end justify-center">
          <h1 className="text-white text-2xl font-bold mb-4 px-2 opacity-90">
            {imovel?.endereco}
          </h1>
        </div>
      </div>

      <div className="px-4 mt-5">
      <Card className="my-3">
        <CardContent className="p-5">
          <CardHeader className="flex-row items-center gap-4 p-0">
            <Captions className="text-primary w-8 h-8"/> 
            <h3 className="text-white text-lg font-semibold">Visão Geral do Imóvel</h3>
          </CardHeader>
          <p className="text-sm text-gray-400 mt-4">Apartamento espaçoso e reformado localizado no coração da cidade. Possui 3 
            quartos, 2 banheiros, sala de estar ampla e cozinha gourmet. Ideal para famílias ou investidores.</p>
        </CardContent>
      </Card>

      <Card className="my-3">
        <CardContent className="px-5 flex justify-between items-center">
          <p className="text-sm text-gray-400 mt-4 ">Status da reforma</p>
          <Badge className="mt-auto">{imovel?.status}</Badge>
        </CardContent>
      </Card>

      <Card className="my-3">
        <CardContent className="px-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400 mt-4 ">Prazo Final</p>
            <p>31/12/2025</p>
          </div>
          <Badge className="mt-auto bg-yellow-500">Aguardando</Badge>
        </CardContent>
      </Card>

      <Card className="my-3">
        <CardContent className="p-5">
          <CardHeader className="flex-row items-center gap-4 p-0">
            <FileText className="text-primary w-8 h-8"/> 
            <h3 className="text-white text-lg font-semibold">Documentação</h3>
          </CardHeader>
          <p className="text-sm text-gray-400 mt-4">Disponível para download: Contrato de Compra e Venda,
             Planta Baixa, Memorial Descritivo.</p>

          <Button className="mt-4" variant="secondary">
            <ArrowDown/> Baixar Documentação</Button>
        </CardContent>
      </Card>

      <MaterialsButton/>
      </div>
    </div>
  );
}

export default ImovelPage;

// Adicionar detalhes, prazo final no banco de dados