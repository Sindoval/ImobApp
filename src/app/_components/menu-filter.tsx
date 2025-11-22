"use client";

import { Funnel } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../_lib/utils";
import { useEffect, useState } from "react";
import { ImovelComImagens } from "../_types/estoque";
import { toUnderscored } from "@/utils/stringFormatting";

interface MenuFIlterProps {
  imoveis: ImovelComImagens[]
  handleImovelFilter: (imoveis: ImovelComImagens[]) => void
}

const MenuFilter = ({ imoveis, handleImovelFilter }: MenuFIlterProps) => {
  const [ativo, setAtivo] = useState<string | null>(null);

  const filtros = [
    { nome: "Todos", icon: Funnel },
    { nome: "Planejamento", icon: Funnel },
    { nome: "Em Reforma", icon: Funnel },
    { nome: "Reforma concluída", icon: Funnel },
  ];

  const clickFilter = (nome: string) => {
    setAtivo(ativo === nome ? null : nome);
    if (nome === "Todos") {
      handleImovelFilter(imoveis);
      return;
    }
    const imoveisFilter = imoveis.filter((imovel) => imovel.status === toUnderscored(nome));
    handleImovelFilter(imoveisFilter);
  }

  return (
    <div className="w-[95%] my-4 flex items-center gap-2 overflow-x-auto flex-nowrap px-2 scrollbar-none">
      {/* Badge Filtros */}
      <Badge
        className="inline-flex items-center justify-center shrink-0 whitespace-nowrap cursor-pointer transition-colors select-none px-4 py-1"
        variant="secondary"
      >
        <Funnel width={12} className="mr-1" />
        Filtros
      </Badge>

      {/* Badges dos filtros */}
      {filtros.map(({ nome }) => (
        <Badge
          key={nome}
          onClick={() => clickFilter(nome)}
          variant="secondary"
          className={cn(
            "inline-flex items-center justify-center shrink-0 whitespace-nowrap cursor-pointer transition-colors select-none px-4 py-2",
            ativo === nome
              ? "!bg-primary !text-primary-foreground !border-primary"
              : "hover:bg-muted"
          )}
        >
          {nome}
        </Badge>
      ))}
    </div>
  );
};

export default MenuFilter;
