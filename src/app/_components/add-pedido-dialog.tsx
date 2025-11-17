import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { toast } from "sonner";

// --------------- SCHEMA ZOD --------------- //
const pedidoItemSchema = z.object({
  nome: z.string().min(1, "Informe o nome do item"),
  quantidade: z.number().min(1, "Quantidade mínima 1"),
  precoUnit: z.number().min(0, "Preço deve ser >= 0"),
});

const pedidoSchema = z.object({
  descricao: z.string().min(1),
  doEstoque: z.boolean().default(false),
  fornecedorId: z.string().nullable().optional(),
  itens: z.array(pedidoItemSchema).min(1),
});

type PedidoFormType = z.infer<typeof pedidoSchema>;

interface Fornecedor {
  id: string;
  nome: string;
}

interface AddPedidoDialogProps {
  imovelId: string;
  fornecedores: Fornecedor[] | undefined;
  openPedidoDialog: boolean,
  handlePedidoDialog: (open: boolean) => void
}

export function AddPedidoDialog({ imovelId, fornecedores, openPedidoDialog, handlePedidoDialog }: AddPedidoDialogProps) {

  const form = useForm<PedidoFormType>({
    resolver: (zodResolver(pedidoSchema) as unknown) as any,
    defaultValues: {
      descricao: "",
      doEstoque: false,
      fornecedorId: null,
      itens: [{ nome: "", quantidade: 1, precoUnit: 0 }],
    },
    mode: "onSubmit",
  });

  const { register, handleSubmit, control, watch, reset, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const doEstoque = watch("doEstoque");

  // ------- ENVIO PARA A API ------- //
  const onSubmit = async (data: PedidoFormType) => {
    const response = await fetch("/api/users/me");
    const { user } = await response.json();
    try {
      const payload = {
        descricao: data.descricao,
        doEstoque: data.doEstoque,
        fornecedorId: data.doEstoque ? null : data.fornecedorId ?? null,
        imovelId,
        criadoPorId: user.id,
        itens: data.itens.map((it) => ({
          nome: it.nome,
          quantidade: Number(it.quantidade),
          precoUnit: Number(it.precoUnit),
        })),
      };

      const res = await fetch("/api/pedidos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Pedido Criado com sucesso!")

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Erro ao criar pedido");
      }

      // sucesso
      handlePedidoDialog(false);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pedido");
    }
  };

  return (
    <Dialog open={openPedidoDialog} onOpenChange={handlePedidoDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full mt-3 h-12">Novo Pedido</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição da Solicitação</Label>
            <Textarea
              {...register("descricao")}
              placeholder="Ex: Solicitação de cimento, areia..."
            />
          </div>

          {/* Checkbox — é do estoque? */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={doEstoque}
              onCheckedChange={(v) => setValue("doEstoque", !!v)}
            />
            <Label>Retirar do estoque</Label>
          </div>

          {/* Fornecedor — APARECE SÓ SE NÃO FOR DO ESTOQUE */}
          {!doEstoque && (
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select
                onValueChange={(v) => setValue("fornecedorId", v)}
                value={form.getValues().fornecedorId ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores && fornecedores.map((forn) => (
                    <SelectItem key={forn.id} value={forn.id}>
                      {forn.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ITENS DO PEDIDO */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Itens</Label>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-3 bg-muted/40 p-3 rounded-xl"
              >
                <div className="col-span-6">
                  <Label>Nome</Label>
                  <Input {...register(`itens.${index}.nome` as const)} />
                </div>

                <div className="col-span-3">
                  <Label>Qtd</Label>
                  <Input
                    type="number"
                    {...register(`itens.${index}.quantidade` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="col-span-3">
                  <Label>Preço Unit.</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`itens.${index}.precoUnit` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="col-span-12 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="text-xs"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              type="button"
              onClick={() => append({ nome: "", quantidade: 1, precoUnit: 0 })}
            >
              + Adicionar item
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit">Salvar Pedido</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
