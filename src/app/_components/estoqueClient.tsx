"use client"

import { Funnel, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import CardEstoque from "./card-estoque";
import { EstoqueComProduto } from "../_types/estoque";
import AddProductDialog from "./add-product-dialog";

interface EstoqueClientProps {
  estoqueList: EstoqueComProduto[]
}

const EstoqueClient = ({ estoqueList }: EstoqueClientProps) => {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listaEstoque, setListaEstoque] = useState(estoqueList);

  useEffect(() => {
    setListaEstoque(estoqueList);
  }, [listaEstoque]);

  const handleAddEstoque = (novoEstoque: EstoqueComProduto) => {
      setListaEstoque((prev) => [...prev, novoEstoque]);
      setIsDialogOpen(false);
    }

  const filteredList = useMemo(() => {
    const term = search.toLowerCase();
    return estoqueList.filter((item) =>
      item.produto.nome.toLowerCase().includes(term) ||
      item.produto.descricao?.toLowerCase().includes(term)
    );
  }, [search, estoqueList])

  return (
    <div className="w-[85%] h-screen">

      <div className="relative my-4 flex gap-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 flex-1 bg-secondary"
          placeholder="Buscar material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline"><Funnel /></Button>
      </div>

      <h2 className="text-xl font-bold text-gray-200 py-3">Itens no Estoque</h2>

      <div className="w-[80%] my-4 ">
              <Button
                className="px-3"
                variant="secondary"
                onClick={() => setIsDialogOpen(true)}
              >+ Adicionar Produto ao Estoque</ Button>
            </div>

      {/* lista do estoque */}
      <div className="w-full h-[70%] flex-col mt-10 overflow-y-auto no-scrollbar">
        {filteredList.length > 0 ? (
          filteredList.map((e) => (
            <CardEstoque
              key={e.id}
              estoqueItem={e}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center mt-5">Nenhum item encontrado.</p>
        )}
      </div>
        <AddProductDialog 
          open={isDialogOpen}
          onChangeOpen={setIsDialogOpen}
          ondAdd={handleAddEstoque}
          />
    </div>
  );
}

export default EstoqueClient;