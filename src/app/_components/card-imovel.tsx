"use client"

import { Imovel } from "@/generated/prisma";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, Trash } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { useRouter } from "next/navigation";

interface CardImovelProps {
  imovel: Imovel
}

const CardImovel = ({ imovel }: CardImovelProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onClickRemove = () => {
    setIsDialogOpen(true);
  }

  const onClickConfirmRemove = async () => {
    await fetch(`/api/imoveis/${imovel.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setIsDialogOpen(false);
    router.refresh();
  }

  return (
    <Card className="w-[80%] min-h-[50%] rounded-md mx-auto mt-3 mb-6 border-0 ">
      <div className="relative aspect-video w-full">
        <Image
          alt="imovel Image"
          src="/imovel.jpg"
          className="rounded-md object-cover"
          fill
        />
        <Button
          variant="destructive"
          className="absolute top-2 right-2 text-white p-2 rounded-full transition opacity-60 hover:opacity-100"
          onClick={() => onClickRemove()}

        ><Trash /></Button>
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

      <Dialog open={isDialogOpen}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <h1 className="text-xl font-bold">Confirmar Exclusão</h1>
          </DialogHeader>
          <div className="mb-4">
            <h2 className="text-sm text-center text-gray-400">Esta ação apagará permanentemente o imóvel e todos os dados associados. Você tem certeza que deseja continuar?</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >Cancelar</Button>
          <Button
            variant="destructive"
            onClick={() => onClickConfirmRemove()}
          >Apagar</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default CardImovel;