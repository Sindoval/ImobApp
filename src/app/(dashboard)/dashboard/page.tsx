import Header from "@/app/_components/header";
import { Card, CardContent } from "@/app/_components/ui/card";
import { BrickWall, ChartNoAxesCombined, CheckCheck, House } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getImoveis } from "@/app/_actions/imoveis";
import { getPedidos } from "@/app/_actions/pedidos";
import CardPedido from "@/app/_components/card-pedido";

const Dashboard = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const imoveis = await getImoveis();
  const pedidos = await getPedidos();

  if (!token) {
    redirect("/login")
  }
  return (
    <div className="flex flex-col items-center h-screen">
      <Header />
      <div className="flex flex-col items-start w-[90%] max-w-6xl h-[50%] rounded-xl p-4">
        <h1 className="text-xl font-bold text-gray-100 my-4 px-2">Resumo de Propriedades</h1>


        <div className="w-full grid grid-cols-2 xl:grid-cols-4 gap-2 p-1 rounded-lg">

          <Card className="h-40">
            <CardContent className="p-3">
              <House />
              <p className="text-2xl font-bold text-primary mt-4">{imoveis.length}</p>
              <p className="text-lg text-gray-400 mt-2">Total de Imóveis</p>
            </CardContent>
          </Card>

          <Card className="h-40">
            <CardContent className="p-3">
              <ChartNoAxesCombined />
              <p className="text-2xl font-bold text-yellow-400 mt-4">{imoveis.filter((imovel) => imovel.status === "planejamento").length}</p>
              <p className="text-lg text-gray-400 mt-2">Planejamento</p>
            </CardContent>
          </Card>

          <Card className="h-40">
            <CardContent className="p-3">
              <BrickWall />
              <p className="text-2xl font-bold text-green-400 mt-4">{imoveis.filter((imovel) => imovel.status === "em_reforma").length}</p>
              <p className="text-lg text-gray-400 mt-2">Em Reforma</p>
            </CardContent>
          </Card>

          <Card className="h-40">
            <CardContent className="p-3">
              <CheckCheck />
              <p className="text-2xl font-bold text-cyan-400 mt-4">{imoveis.filter((imovel) => imovel.status === "reforma_concluida").length}</p>
              <p className="text-lg text-gray-400 mt-2">Reforma Concluída</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col w-[90%] max-w-6xl h-[40%] rounded-xl p-4">
        <h1 className="text-xl font-bold text-gray-100 px-2">Pedidos Solicitados</h1>

        <div className="w-full h-full overflow-y-auto mt-4 flex-col">
          {pedidos.map((pedido) => (
            <CardPedido
              key={pedido.id}
              pedido={pedido}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;