import { Card } from "./ui/card";
import { EstoqueComProduto } from "../_types/estoque";
import { Button } from "./ui/button";

interface CardEstoqueProps {
  estoqueItem: EstoqueComProduto
}

const CardEstoque = ({ estoqueItem }: CardEstoqueProps) => {
  const { quantidade, produto } = estoqueItem;
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
        <div className="flex justify-end my-auto gap-2 mt-auto">
          <Button variant="secondary">Editar</Button>
          <Button variant="destructive">Remover</Button>
        </div>

      </div>
    </Card>
  );
}

export default CardEstoque;