"use client"
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Imovel, Usuario } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { getUsers } from "../_actions/usuarios";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Check, X } from "lucide-react";
import { ImovelComImagens } from "../_types/estoque";

interface AddImovelDialogProps {
  open: boolean,
  onChangeOpen: (open: boolean) => void
  ondAdd: (imovel: ImovelComImagens) => void
}

const AddImovelDialog = ({ open, onChangeOpen, ondAdd }: AddImovelDialogProps) => {
  const [form, setForm] = useState({
    endereco: "",
    descricao: "",
    valorCompra: "",
    valorVenda: "",
    status: "planejamento",
    eng_responsavel: "",
  });
  const [engenheirosList, setEngenheirosList] = useState<Usuario[]>([])

  useEffect(() => {
    const fetchEngenheiros = async () => {
      const usuarios = await getUsers();
      const usuariosFilter = usuarios.filter((user) => user.roleId === "cmhs2nwy80001vz64dazjv99y");
      setEngenheirosList(usuariosFilter);
    }
    fetchEngenheiros();
  }, [])

  const handleSubmit = async () => {
    const { endereco, descricao, valorCompra, valorVenda, status } = form;
    // API - POST
    const engenheiro = engenheirosList.find((eng) => eng.nome === form.eng_responsavel);
    const bodyPost = {
      endereco,
      descricao,
      valorCompra: Number(valorCompra),
      valorVenda: Number(valorVenda),
      status,
      engenheiroId: engenheiro?.id
    }

    const res = await fetch("/api/imoveis/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPost),
      credentials: "include",
    });

    const { imovel } = await res.json();

    onChangeOpen(false);
    setForm({
      endereco: "",
      descricao: "",
      valorCompra: "",
      valorVenda: "",
      eng_responsavel: "",
      status: "planejamento",
    });

    ondAdd(imovel);
  }

  const onClickCancelar = () => {
    onChangeOpen(false);
    setForm({
      endereco: "",
      descricao: "",
      valorCompra: "",
      valorVenda: "",
      eng_responsavel: "",
      status: "planejamento",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="w-[90%]">
        <DialogHeader>
          <DialogTitle>
            <div className="border-b mb-7">
              <h2 className="text-xl font-bold">Adicionar Novo Imóvel</h2>
              <p className="text-sm font-semibold text-gray-600 mt-2 mb-6">Preencha os dados do imóvel abaixo</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-1 py-2">
            <p>Endereço</p>
            <Input
              placeholder="Rua Exemplo, 123, Bairro..."
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Descrição do Imóvel</p>
            <Input
              placeholder="Casa de 3 Quartos, localizado..."
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Valor de Compra</p>
            <Input
              placeholder="R$ 100.000,00"
              value={form.valorCompra}
              onChange={(e) => setForm({ ...form, valorCompra: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Valor de Venda</p>
            <Input
              placeholder="R$ 150.000,00"
              value={form.valorVenda}
              onChange={(e) => setForm({ ...form, valorVenda: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Engenheiro Responsável</p>
            <Select
              value={form.eng_responsavel}
              onValueChange={(value) => setForm({ ...form, eng_responsavel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Engenheiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Engenheiros</SelectLabel>
                  {engenheirosList.map((engenheiro) => (
                    <SelectItem key={engenheiro.id} value={engenheiro.nome}>
                      {engenheiro.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
          > <Check /> Salvar Imóvel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddImovelDialog;