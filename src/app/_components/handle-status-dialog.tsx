"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
// Importando o Badge para listar os status
import { Badge } from "@/app/_components/ui/badge";
import { useRouter } from "next/navigation"; // Adicionei o useRouter, que é bom para refresh
import { toUnderscored } from "@/utils/stringFormatting";

interface HandleStatusDialogProp {
  openStatusDialog: boolean
  handleStatusDialog: (open: boolean) => void
  handleStatusUpdate: (newStatus: string) => void
  id: string
  status: string | null
}

const HandleStatusDialog = ({ openStatusDialog, handleStatusDialog, handleStatusUpdate, status, id }: HandleStatusDialogProp) => {
  const [statusText, setStatusText] = useState(status ?? "");

  const statusList = ["Planejamento", "Em Reforma", "Reforma Concluída"];

  const imovelUpdate = async () => {
    if (!statusText) {
      return toast.error("Selecione um status para atualizar o imóvel.");
    }

    try {
      const response = await fetch(`/api/imoveis/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: toUnderscored(statusText) }),
        credentials: "include",
      });

      if (!response.ok) {
        return toast.error("Erro ao Atualizar status do imóvel");
      }

      const updatedImovel = await response.json();

      toast.success("Status do imóvel atualizado com sucesso!");
      handleStatusDialog(false);

      handleStatusUpdate(updatedImovel.status);

    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro inesperado na atualização.");
    }
  }

  return (
    <Dialog open={openStatusDialog} onOpenChange={handleStatusDialog}>
      <DialogContent className="w-[90%] max-w-lg">
        <DialogHeader>
          <DialogTitle>Atualizar Status da Reforma</DialogTitle>
        </DialogHeader>

        {/* Área de seleção de Status */}
        <div className="flex flex-col gap-3 p-4 border rounded-lg mt-3 ">
          <p className="text-sm text-gray-400 font-medium">Selecione o novo status:</p>
          <div className="flex flex-wrap gap-2">
            {statusList.map((s) => (
              <Badge
                key={s}
                variant={statusText === s ? "default" : "outline"}
                className={`
                            cursor-pointer text-base py-2 px-4 transition-all rounded-full 
                            ${statusText === s
                    ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                    : "hover:bg-neutral-700 text-gray-300 border-neutral-600"
                  }
                        `}
                onClick={() => setStatusText(s)}
              >
                {s}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-8">Status Atual: <span className="font-semibold text-white">{statusText || "Não definido"}</span></p>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="destructive"
            onClick={() => handleStatusDialog(false)}
          >Cancelar</Button>
          <Button
            className="my-3"
            onClick={imovelUpdate}
          >Atualizar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HandleStatusDialog;