import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "../../_components/header";
import { getImoveis } from "@/app/_actions/imoveis";
import CardImovel from "@/app/_components/card-imovel";

const Imoveis = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const imoveis = await getImoveis();

  if (!token) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <Header />
      <h1 className="text-2xl font-bold text-gray-200 py-3">Imóveis</h1>

      {/* Imóveis */}
      <div className="flex-1 w-[90%] flex-col gap-3 overflow-y-auto no-scrollbar">
        {imoveis.map((imovel) => (
          <CardImovel
            key={imovel.id}
            imovel={imovel} />
        ))}
      </div>
    </div>
  );
}

export default Imoveis;


// id, endereco, valoCompra, valorVenda, status, engenhieroId
