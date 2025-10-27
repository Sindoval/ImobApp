import { Card } from "./ui/card";
import { EstoqueComProduto } from "../_types/estoque";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Estoque } from "@/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

interface CardEstoqueProps {
  estoqueItem: EstoqueComProduto
}

const CardEstoque = ({ estoqueItem }: CardEstoqueProps) => {
  const [isPrimaryDialog, setIsPrimaryDialog] = useState(false);
  const [isSecondaryDialog, setIsSecondaryDialog] = useState(false);
  const [typeDialog, setTypeDialog] = useState<"adicionar" | "subtrair">("adicionar");
  const [titleDialog, setTitleDialog] = useState("");
  const [messageDialog, setMessageDialog] = useState("");
  const [inputDialog, setInputDialog] = useState(0);
  
  const router = useRouter();
  const { quantidade, produto } = estoqueItem;

  const onChangeDialogMessage = (type: "adicionar" | "subtrair") => {
    if ( type === "adicionar" ) {
      setTypeDialog("adicionar");
      setTitleDialog("Adicionar itens no Estoque");
      setMessageDialog(`Informe a quantidadade de ${ produto.nome} a ser adicionada no estoque: `);
      setIsPrimaryDialog(true);
      return;
    }
    setTypeDialog("subtrair")
    setTitleDialog("Subtrair itens do Estoque");
    setMessageDialog(`Informe a quantidadade de ${produto.nome} a ser subtraída do estoque: `);
    setIsPrimaryDialog(true);
    return;
 } 

  const putEstoque = async (type: "adicionar" | "subtrair", quantidade: number) => {
    const itemEstoque = await fetch(`/api/estoque/${estoqueItem.id}`);
    const data: Estoque = await itemEstoque.json();

    if ( type === "subtrair" && quantidade > data.quantidade) {
      return toast.error("Valor informado é maior que a quantidade em estoque. Favor informar um novo valor válido.")
    }
    
      const response = await fetch(`/api/estoque/${estoqueItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantidade: type === "subtrair" ? data.quantidade - quantidade : data.quantidade + quantidade
      }),
      credentials: "include",
    });
      if (!response.ok) {
        toast.error("Erro ao atualizar o estoque");
        const erro = await response.json();
        throw new Error(erro.error || "Erro ao atualizar o estoque");
      }
      setIsPrimaryDialog(false);
      setInputDialog(0);
      router.refresh();
      toast.success("Estoque atualizado com sucesso!");
      return;
  }

  const onClickConfirmRemove = async () => {
    await fetch(`/api/estoque/${estoqueItem.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setIsSecondaryDialog(false);
    router.refresh();
  }


  return (
    <Card className="w-full mb-3 p-5 flex flex-col justify-between  border border-gray-700">
      <div className="">
        <h2 className="text-lg font-semibold text-gray-200">{produto.nome}</h2>
        <div className="mt-5">
          <p className="text-gray-400">Quantidade: <span className="text-xl text-primary font-bold ">{quantidade}</span></p>
          <p className="text-gray-400">Unidade de Medida: <span className="text-primary">{produto.unidade}</span></p>
          <p className="text-gray-400 mt-2">{produto.descricao}</p>
        </div>
        <hr className="w-full my-3" />
        <div className="flex justify-between my-auto gap-2 mt-auto">
          <div className="space-x-2">
          <Button 
            variant="default"
            className="rounded-full"
            onClick={ () => onChangeDialogMessage("adicionar")}
            ><Plus/></Button>
          <Button 
            variant="secondary"
            className="rounded-full"
            onClick={ () => onChangeDialogMessage("subtrair")}
            ><Minus/></Button>
          </div>
          <Button 
            variant="destructive"
            onClick={ () => setIsSecondaryDialog(true) }
            >Remover</Button>
        </div>

      </div>
      <Dialog open={isPrimaryDialog}>
              <DialogContent className="w-[80%]">
                <DialogHeader>
                  <h1 className="text-xl font-bold">{titleDialog}</h1>
                </DialogHeader>
                <div className="mb-4">
                  <h2 className="text-sm text-center text-gray-400 mb-4">{ messageDialog }</h2>
                  <Input 
                    type="number"
                    onChange={ (e) => setInputDialog(Number(e.target.value)) }
                    />
                </div>
                <Button
                  variant="default"
                  onClick={() => typeDialog === "adicionar" ? putEstoque("adicionar", inputDialog) : putEstoque("subtrair", inputDialog)}
                >Confirmar</Button>
                <Button
                  variant="destructive"
                  onClick={ () => setIsPrimaryDialog(false) }
                >Cancelar</Button>
              </DialogContent>
            </Dialog>

            <Dialog open={ isSecondaryDialog }>
                    <DialogContent className="w-[80%]">
                      <DialogHeader>
                        <h1 className="text-xl font-bold">Confirmar Exclusão</h1>
                      </DialogHeader>
                      <div className="mb-4">
                        <h2 className="text-sm text-center text-gray-400">Esta ação apagará permanentemente {produto.nome} do estoque e todos os dados associados. Você tem certeza que deseja continuar?</h2>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsSecondaryDialog(false)}
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

export default CardEstoque;

//Esta ação apagará permanentemente o imóvel e todos os dados associados. Você tem certeza que deseja continuar?