"use client"

import { Funnel } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../_lib/utils";
import { useState } from "react";

const MenuFilter = () => {
  const [ativo, setAtivo] = useState<string | null>(null)

  const filtros = [
    { nome: "À Venda", icon: Funnel },
    { nome: "Em Reforma", icon: Funnel },
    { nome: "Aluguel", icon: Funnel },
  ]

  return (
    <div className="w-[95%] my-4 flex justify-center items-center gap-2 flex-nowrap overflow-x-auto">
      <Badge className="flex items-center justify-center w-42 h-8 cursor-pointer transition-colors select-none px-4" variant="secondary"> <Funnel width={16} />Filtros</Badge>
      {
        filtros.map(({ nome }) => (
          <Badge
            key={nome}
            variant="secondary"
            onClick={() => setAtivo(ativo === nome ? null : nome)}
            className={cn(
              "flex items-center justify-center w-42 h-8 cursor-pointer transition-colors select-none px-4",
              ativo === nome
                ? "!bg-primary !text-primary-foreground !border-primary"
                : "hover:bg-muted"
            )}
          >
            {nome}
          </Badge>
        ))
      }
    </div >
  );
}

export default MenuFilter;