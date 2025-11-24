"use client";

import React from "react";
import { PedidoInfo } from "../_types/estoque";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, User } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { PedidoItem } from "@/generated/prisma";

interface CardPedidoProp {
  pedido: PedidoInfo;
}

export function CardPedido({ pedido }: CardPedidoProp) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-600 text-yellow-50";
      case "negado":
        return "bg-red-600 text-red-50";
      default:
        return "bg-green-500 text-gray-100";
    }
  };

  return (
    <Dialog>
      {/* O CARD É O BOTÃO DO DIALOG */}
      <DialogTrigger asChild>
        <Card className="mb-3 cursor-pointer hover:bg-muted/40 transition w-full">
          <CardContent className="w-full h-full p-4 flex justify-between items-center min-w-0">

            <div className="flex flex-col justify-center space-y-1.5 overflow-hidden min-w-0">
              <h2 className="text-lg font-bold text-white truncate flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-primary" />
                {pedido.imovel?.endereco || 'Imóvel Desconhecido'}
              </h2>

              <p className="text-sm text-gray-400 flex items-center gap-2 truncate min-w-0">
                <User className="w-3 h-3 text-gray-500" />
                Solicitado por: <span className="font-medium text-gray-200">{pedido.criadoPor.nome}</span>
              </p>

              <p className="text-xs text-gray-400 mt-1.5 leading-tight line-clamp-2 min-w-0">
                {pedido.descricao}
              </p>
            </div>

            <div className="flex-shrink-0 self-start pt-1">
              <Badge className={`font-semibold text-sm px-3 py-1 ${getStatusColor(pedido.status)}`}>
                {pedido.status}
              </Badge>
            </div>

          </CardContent>

        </Card>
      </DialogTrigger>

      {/* DIALOG */}
      <DialogContent className="w-[90%] max-w-[500px] sm:max-w-[600px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Pedido</DialogTitle>
        </DialogHeader>

        {/* ENDEREÇO */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm text-gray-400">Imóvel</h3>
          <p className="text-lg font-semibold">
            {pedido.imovel?.endereco || "Imóvel não informado"}
          </p>
        </div>

        {/* SOLICITANTE */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm text-gray-400">Solicitado por</h3>
          <p className="text-base font-medium">{pedido.criadoPor.nome}</p>
        </div>

        {/* STATUS */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm text-gray-400">Status</h3>
          <Badge
            className={`font-semibold text-sm px-3 py-1 ${getStatusColor(
              pedido.status
            )}`}
          >
            {pedido.status}
          </Badge>
        </div>

        {/* DESCRIÇÃO COMPLETA */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm text-gray-400">Descrição Completa</h3>
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {pedido.descricao}
          </p>
        </div>

        {/* ITENS */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-400 mb-2">Itens do Pedido</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Qtd</th>
                  <th className="text-left p-2">Preço</th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map((it: PedidoItem) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2">{it.nome}</td>
                    <td className="p-2">{it.quantidade}</td>
                    <td className="p-2">
                      {it.precoUnit
                        ? `R$ ${it.precoUnit.toFixed(2)}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FORNECEDOR */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-400 mb-1">Origem</h3>
          {pedido.fornecedor ? (
            <p className="font-medium">{pedido.fornecedor.nome}</p>
          ) : (
            <p className="font-medium text-blue-300">Retirado do Estoque</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CardPedido;
