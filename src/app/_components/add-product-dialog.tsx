"use client"
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Produto } from "@/generated/prisma";
import { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Check, X } from "lucide-react";
import { EstoqueComProduto } from "../_types/estoque";

interface AddProductDialogProps {
  open: boolean,
  onChangeOpen: (open: boolean) => void
  ondAdd: (produto: EstoqueComProduto) => void
}

const AddProductDialog = ({ open, onChangeOpen, ondAdd }: AddProductDialogProps) => {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    unidade: "",
    quantidade: "",
  });


  const handleSubmit = async () => {
    const { nome, descricao, unidade, quantidade } = form;
    // API - POST
    const bodyPost = {
      nome,
      descricao,
      unidade
    }

    const resProduct = await fetch("/api/produto/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPost),
      credentials: "include",
    });

    const { produto } = await resProduct.json();

    const resEstoque = await fetch("/api/estoque/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({produtoId: produto.id, quantidade: Number(quantidade)}),
      credentials: "include",
    });

    const { estoque } = await resEstoque.json();

    onChangeOpen(false);
    setForm({
      nome: "",
      descricao: "",
      unidade: "",
      quantidade: "",
    });

    ondAdd(estoque);
  }

  const onClickCancelar = () => {
    onChangeOpen(false);
    setForm({
      nome: "",
      descricao: "",
      unidade: "",
      quantidade: "",
    });
  }

  return (
    <Dialog open={open}>
      <DialogContent className="w-[90%]">
        <DialogHeader>
          <DialogTitle>
            <div className="border-b mb-7">
              <h2 className="text-xl font-bold">Adicionar Novo Produto ao Estoque</h2>
              <p className="text-sm font-semibold text-gray-600 mt-2 mb-6">Preencha os dados do produto abaixo</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-1 py-2">
            <p>Nome</p>
            <Input
              placeholder="Piso Cerâmico"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Descrição</p>
            <Input
              placeholder="Caixa com 10 unidades"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Unidade de Medida</p>
            <Input
              placeholder="saco, caixa, unidade, lata"
              value={form.unidade}
              onChange={(e) => setForm({ ...form, unidade: e.target.value })}
            />
          </div>

          <div className="space-y-1 py-2">
            <p>Quantidade que será adicionado ao estoque</p>
            <Input
              type="number"
              placeholder="10, 20, 100"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            />
          </div>

        </div>
        <DialogFooter className="pb-10">
          <Button
            variant="destructive"
            onClick={() => onClickCancelar()}>
            <X /> Cancelar</Button>
          <Button
            className="my-4"
            onClick={() => handleSubmit()}
          > <Check /> Salvar Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductDialog;