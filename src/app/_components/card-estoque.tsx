"use client";

import { Card } from "./ui/card";
import { EstoqueComProduto, ImovelComImagens } from "../_types/estoque";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Estoque } from "@/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

interface CardEstoqueProps {
  estoqueItem: EstoqueComProduto;
  imoveis: ImovelComImagens[];
}

const CardEstoque = ({ estoqueItem, imoveis }: CardEstoqueProps) => {
  const [isPrimaryDialog, setIsPrimaryDialog] = useState(false);
  const [isSecondaryDialog, setIsSecondaryDialog] = useState(false);
  const [typeDialog, setTypeDialog] = useState<"adicionar" | "subtrair">("adicionar");
  const [titleDialog, setTitleDialog] = useState("");
  const [messageDialog, setMessageDialog] = useState("");
  const [inputDialog, setInputDialog] = useState(0);
  const [selectedImovel, setSelectedImovel] = useState<string | null>(null);

  const router = useRouter();
  const { quantidade, produto } = estoqueItem;

  const onChangeDialogMessage = (type: "adicionar" | "subtrair") => {
    setTypeDialog(type);
    if (type === "adicionar") {
      setTitleDialog("Adicionar itens no Estoque");
      setMessageDialog(`Informe a quantidade de ${produto.nome} a ser adicionada:`);
    } else {
      setTitleDialog("Subtrair itens do Estoque");
      setMessageDialog(`Informe a quantidade de ${produto.nome} a ser subtraída:`);
    }
    setIsPrimaryDialog(true);
  };

  const putEstoque = async (type: "adicionar" | "subtrair", quantidade: number) => {
    const itemEstoque = await fetch(`/api/estoque/${estoqueItem.id}`);
    const data: Estoque = await itemEstoque.json();

    if (type === "subtrair" && quantidade > data.quantidade) {
      return toast.error("Valor informado é maior que a quantidade em estoque.");
    }

    const response = await fetch(`/api/estoque/${estoqueItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantidade:
          type === "subtrair"
            ? data.quantidade - quantidade
            : data.quantidade + quantidade,
      }),
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      toast.error("Erro ao atualizar o estoque");
      return;
    }

    return true;
  };

  const criarPedidoDeSaidaDoEstoque = async (quantidade: number) => {
    if (!selectedImovel) {
      return toast.error("Selecione o imóvel para onde o material será enviado.");
    }

    const imovel = imoveis.find((i) => i.id === selectedImovel);

    const descricao = `
Retirada de material do estoque
Produto: ${produto.nome}
Imóvel: ${imovel?.endereco}
Quantidade retirada: ${quantidade}
  `.trim();

    const payload = {
      descricao,
      doEstoque: true,
      fornecedorId: null,
      imovelId: selectedImovel,
      itens: [
        {
          nome: produto.nome,
          quantidade,
          precoUnit: 0,
        },
      ],
    };

    const res = await fetch("/api/pedidos/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return toast.error("Erro ao criar pedido de retirada do estoque");
    }

    toast.success("Pedido criado com sucesso!");
  };

  const onClickConfirmPrimary = async () => {
    if (inputDialog <= 0) {
      return toast.error("Informe uma quantidade válida.");
    }

    // Se for subtração, exigir imóvel
    if (typeDialog === "subtrair" && !selectedImovel) {
      return toast.error("Selecione o imóvel para a retirada.");
    }

    const sucesso = await putEstoque(typeDialog, inputDialog);

    if (!sucesso) return;

    // Se for retirada → criar pedido
    if (typeDialog === "subtrair") {
      await criarPedidoDeSaidaDoEstoque(inputDialog);
    }

    setIsPrimaryDialog(false);
    setInputDialog(0);
    setSelectedImovel(null);
    router.refresh();
  };

  const onClickConfirmRemove = async () => {
    await fetch(`/api/estoque/${estoqueItem.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setIsSecondaryDialog(false);
    router.refresh();
  };

  return (
    <Card className="w-full mb-3 p-5 flex flex-col justify-between border border-gray-700">
      <div>
        <h2 className="text-lg font-semibold text-gray-200">{produto.nome}</h2>
        <div className="mt-5">
          <p className="text-gray-400">
            Quantidade:
            <span className="text-xl text-primary font-bold"> {quantidade}</span>
          </p>
          <p className="text-gray-400">
            Unidade de Medida: <span className="text-primary">{produto.unidade}</span>
          </p>
          <p className="text-gray-400 mt-2">{produto.descricao}</p>
        </div>

        <hr className="w-full my-3" />

        <div className="flex justify-between gap-2">
          <div className="space-x-2">
            <Button variant="default" className="rounded-full" onClick={() => onChangeDialogMessage("adicionar")}>
              <Plus />
            </Button>

            <Button variant="secondary" className="rounded-full" onClick={() => onChangeDialogMessage("subtrair")}>
              <Minus />
            </Button>
          </div>

          <Button variant="destructive" onClick={() => setIsSecondaryDialog(true)}>
            Remover
          </Button>
        </div>
      </div>

      {/* DIALOG PRINCIPAL */}
      <Dialog open={isPrimaryDialog} onOpenChange={setIsPrimaryDialog}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <h1 className="text-xl font-bold">{titleDialog}</h1>
          </DialogHeader>

          <div className="mb-4">
            <h2 className="text-sm text-center text-gray-400 mb-4">{messageDialog}</h2>

            {/* Select de imóvel apenas em subtração */}
            {typeDialog === "subtrair" && (
              <div className="mb-4">
                <label className="text-sm text-gray-400">Selecione o imóvel destino:</label>
                <select
                  className="w-full mt-2 p-2 border rounded bg-secondary text-gray-200"
                  onChange={(e) => setSelectedImovel(e.target.value)}
                  value={selectedImovel ?? ""}
                >
                  <option value="">Selecione...</option>
                  {imoveis.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.endereco.length > 40 ? i.endereco.substring(0, 40) + "..." : i.endereco}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label className="text-sm text-gray-400">
              Quantidade a ser subtraída do estoque:
            </label>

            <Input
              type="number"
              className="mt-2"
              onChange={(e) => setInputDialog(Number(e.target.value))}
            />
          </div>

          <Button variant="default" onClick={onClickConfirmPrimary}>
            Confirmar
          </Button>

          <Button variant="destructive" onClick={() => setIsPrimaryDialog(false)}>
            Cancelar
          </Button>
        </DialogContent>
      </Dialog>

      {/* DIALOG DE EXCLUSÃO */}
      <Dialog open={isSecondaryDialog} onOpenChange={setIsSecondaryDialog}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <h1 className="text-xl font-bold">Confirmar Exclusão</h1>
          </DialogHeader>
          <div className="mb-4">
            <h2 className="text-sm text-center text-gray-400">
              Esta ação apagará permanentemente {produto.nome} do estoque. Você tem certeza?
            </h2>
          </div>

          <Button variant="outline" onClick={() => setIsSecondaryDialog(false)}>
            Cancelar
          </Button>

          <Button variant="destructive" onClick={onClickConfirmRemove}>
            Apagar
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CardEstoque;
