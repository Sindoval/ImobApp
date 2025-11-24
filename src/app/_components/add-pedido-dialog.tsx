"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { getEstoque } from "../_actions/estoque";
import { EstoqueComProduto } from "../_types/estoque";

// ------- ZOD SCHEMAS ------- //
const pedidoItemSchema = z.object({
  nome: z.string().min(1, "Informe o nome do item"),
  quantidade: z.number().min(1, "Quantidade mínima 1"),
  precoUnit: z.number().min(0, "Preço deve ser >= 0"),
});

const pedidoSchema = z.object({
  descricao: z.string().optional(),
  doEstoque: z.boolean().default(false),
  fornecedorId: z.string().nullable().optional(),
  itens: z.array(pedidoItemSchema).min(1),
})
  .refine((data) => {
    if (!data.doEstoque) {
      return data.descricao && data.descricao.trim().length > 0;
    }
    return true;
  }, {
    message: "Descrição é obrigatória quando não for retirada do estoque.",
    path: ["descricao"],
  });


type PedidoFormType = z.infer<typeof pedidoSchema>;

interface Fornecedor {
  id: string;
  nome: string;
}

interface AddPedidoDialogProps {
  imovelId: string;
  fornecedores: Fornecedor[] | undefined;
  openPedidoDialog: boolean;
  handlePedidoDialog: (open: boolean) => void;
}

export function AddPedidoDialog({
  imovelId,
  fornecedores,
  openPedidoDialog,
  handlePedidoDialog,
}: AddPedidoDialogProps) {
  const [estoque, setEstoque] = useState<EstoqueComProduto[]>([]);

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

  // ------- Busca o estoque ------- //
  useEffect(() => {
    const fetchEstoque = async () => {
      const estoque = await getEstoque();
      setEstoque(estoque);
    };
    fetchEstoque();
  }, []);

  // ------- Quando marcar "Retirar do estoque", resetar itens e descrição ------- //
  useEffect(() => {
    if (doEstoque) {
      setValue("fornecedorId", null);
      reset({
        ...form.getValues(),
        itens: [{ nome: "", quantidade: 1, precoUnit: 0 }],
        descricao: "",
      });

    }
  }, [doEstoque]);

  // ------- SUBMIT ------- //
  const onSubmit = async (data: PedidoFormType) => {
    const response = await fetch("/api/users/me");
    const { user } = await response.json();

    let descricaoFinal = data.descricao;

    // ------- SE FOR DO ESTOQUE: GERAR DESCRIÇÃO AUTOMÁTICA ------- //
    if (data.doEstoque) {
      const item = estoque.find((e: any) => e.produto.nome === data.itens[0].nome);

      descricaoFinal = `
Retirada de material do estoque
Produto: ${data.itens[0].nome}
Quantidade solicitada: ${data.itens[0].quantidade}
Imóvel: ${imovelId}
      `.trim();
    }

    try {
      const payload = {
        descricao: descricaoFinal,
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Erro ao criar pedido");
      }

      toast.success("Pedido Criado com sucesso!");
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
        <Button variant="default" className="w-full mt-3 h-12">
          Novo Pedido
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* DESCRIÇÃO */}
          {!doEstoque && (
            <div className="space-y-2">
              <Label>Descrição da Solicitação</Label>
              <Textarea
                {...register("descricao")}
                placeholder="Ex: Solicitação de cimento, areia..."
              />
            </div>
          )}

          {/* Checkbox — É do Estoque */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={doEstoque}
              onCheckedChange={(v) => setValue("doEstoque", !!v)}
            />
            <Label>Retirar do estoque</Label>
          </div>

          {/* FORNECEDOR - só aparece se NÃO for do estoque */}
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
                  {fornecedores?.map((forn) => (
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
                {/* NOME DO ITEM */}
                <div className="col-span-6">
                  <Label>Item</Label>

                  {doEstoque ? (
                    <div>
                      <Select
                        onValueChange={(v) =>
                          setValue(`itens.${index}.nome`, v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione do estoque" />
                        </SelectTrigger>

                        <SelectContent>
                          {estoque.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.produto.nome}
                            >
                              {item.produto.nome.length > 40
                                ? item.produto.nome.slice(0, 40) + "..."
                                : item.produto.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* MENSAGEM DE ESTOQUE DISPONÍVEL */}
                      {watch(`itens.${index}.nome`) && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Estoque disponível:{" "}
                          {
                            estoque.find(
                              (e) =>
                                e.produto.nome ===
                                watch(`itens.${index}.nome`)
                            )?.quantidade ?? 0
                          }
                        </p>
                      )}
                    </div>
                  ) : (
                    <Input {...register(`itens.${index}.nome` as const)} />
                  )}
                </div>

                {/* QUANTIDADE */}
                <div className="col-span-3">
                  <Label>Qtd</Label>
                  <Input
                    type="number"
                    {...register(`itens.${index}.quantidade` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {/* PREÇO UNITÁRIO – aparece só se NÃO for do estoque */}
                {!doEstoque && (
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
                )}

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
              onClick={() =>
                append({ nome: "", quantidade: 1, precoUnit: 0 })
              }
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
