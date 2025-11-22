"use client"

import { Imovel } from "@/generated/prisma";
import MenuFilter from "./menu-filter";
import { Button } from "./ui/button";
import CardImovel from "./card-imovel";
import { useEffect, useState } from "react";
import AddImovelDialog from "./add-imovel-dialog";
import { ImovelComImagens } from "../_types/estoque";

interface ImoveisProps {
  imoveis: ImovelComImagens[]
}

const ImoveisClient = ({ imoveis }: ImoveisProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listaImoveis, setListaImoveis] = useState(imoveis);

  const handleAddImovel = (novoImovel: ImovelComImagens) => {
    setListaImoveis((prev) => [...prev, novoImovel]);
    setIsDialogOpen(false);
  }

  const handleImovelFilter = (imoveis: ImovelComImagens[]) => {
    setListaImoveis(imoveis);
  }

  useEffect(() => {
    setListaImoveis(imoveis);
  }, [imoveis])

  return (
    <>
      <MenuFilter imoveis={imoveis} handleImovelFilter={handleImovelFilter} />

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