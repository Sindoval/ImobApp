"use client"

import { Imovel } from "@/generated/prisma";
import MenuFilter from "./menu-filter";
import { Button } from "./ui/button";
import CardImovel from "./card-imovel";
import { useEffect, useState } from "react";
import AddImovelDialog from "./add-imovel-dialog";

interface ImoveisProps {
  imoveis: Imovel[]
}

const ImoveisClient = ({ imoveis }: ImoveisProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listaImoveis, setListaImoveis] = useState(imoveis);

  const handleAddImovel = (novoImovel: Imovel) => {
    setListaImoveis((prev) => [...prev, novoImovel]);
    setIsDialogOpen(false);
  }

  useEffect(() => {
    setListaImoveis(imoveis);
  }, [imoveis])

  return (
    <>
      <MenuFilter />

      <div className="w-[80%] my-4 ">
        <Button
          className="px-3"
          variant="secondary"
          onClick={() => setIsDialogOpen(true)}
        >+ Adicionar Imóvel</Button>

      </div>

      {/* Imóveis */}
      <div className="flex-1 w-full flex-col gap-3 overflow-y-auto no-scrollbar">
        {listaImoveis.map((imovel) => (
          <CardImovel
            key={imovel.id}
            imovel={imovel} />
        ))}
      </div>

      <AddImovelDialog
        open={isDialogOpen}
        onChangeOpen={setIsDialogOpen}
        ondAdd={handleAddImovel}
      />
    </>
  );
}

export default ImoveisClient;