import { Imovel } from "@/generated/prisma";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface CardImovelProps {
  imovel: Imovel
}

const CardImovel = ({ imovel }: CardImovelProps) => {

  return (
    <Card className="w-[90%] min-h-[50%] rounded-md mx-auto mt-3 mb-6 border-0 ">
      <div className="relative aspect-video w-full">
        <Image
          alt="imovel Image"
          src="/imovel.jpg"
          className="rounded-md object-cover"
          fill

        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex w-full h-1/3">
          <div className="w-[80%]">
            <h2 className="text-sm font-bold">{imovel.endereco}</h2>
          </div>
          <div>
            <Badge>{imovel.status}</Badge>
          </div>
        </div>

        <div className=" w-full h-1/3 mt-2">
          <p className="text-sm font-semibold my-1">Valor de Compra: <span className="text-red-500">{imovel.valorCompra}</span></p>
          <p className="text-sm font-semibold">Valor de Venda: <span className="text-green-500">{imovel.valorVenda}</span></p>
        </div>

        <Button className="w-full mt-5">Ver Detalhes <ArrowRight /></Button>
      </CardContent>
    </Card>
  );
}

export default CardImovel;