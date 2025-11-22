"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface HandleVisaoDialogProp {
  openVisaoDialog: boolean
  handleVisaoDialog: (open: boolean) => void
  handleDescriptionUpdate: (newDescription: string) => void
  id: string
  descricao: string | null
}

const HandleVisaoDialog = ({ openVisaoDialog, handleVisaoDialog, handleDescriptionUpdate, descricao, id }: HandleVisaoDialogProp) => {
  const [descricaoText, setDescricaoText] = useState(descricao);

  const imovelUpdate = async () => {
    try {
      const updated = await fetch(`/api/imoveis/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descricao: descricaoText }),
        credentials: "include",
      });

      if (!updated.ok) {
        return toast.error("Erro ao Atualizar descrição do imóvel");
      }
      toast.success("Descrição do imóvel atualizada com sucesso!");
      handleVisaoDialog(false);
      handleDescriptionUpdate(descricaoText ? descricaoText : "");

      return;

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <Dialog open={openVisaoDialog} onOpenChange={handleVisaoDialog}>
      <DialogContent className="w-[90%] h-[65%]">
        <DialogHeader><DialogTitle>Visão Geral do Imóvel</DialogTitle></DialogHeader>
        <Textarea
          value={descricaoText ? descricaoText : ""}
          onChange={(e) => setDescricaoText(e.target.value)}
          className="h-80"
        >
        </Textarea>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => handleVisaoDialog(false)}
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

export default HandleVisaoDialog;