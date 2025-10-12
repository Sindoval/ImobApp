import { getEstoque } from "@/app/_actions/estoque";
import EstoqueClient from "@/app/_components/estoqueClient";
import Header from "@/app/_components/header";

const Estoque = async () => {
  const estoque = await getEstoque();

  return (
    <div className="flex flex-col items-center h-screen">
      <Header />
      <h1 className="text-2xl font-bold text-gray-200 py-3">Estoque de Materiais</h1>
      <hr className="w-full" />
      <EstoqueClient estoqueList={estoque} />

    </div>
  );
}

export default Estoque;