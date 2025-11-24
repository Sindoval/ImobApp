import { PedidoInfo } from "../_types/estoque";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge"; // Importando Badge para o status
import { MapPin, User } from "lucide-react"; // Ícones para melhor clareza

interface CardPedidoProp {
  pedido: PedidoInfo
}

const CardPedido = async ({ pedido }: CardPedidoProp) => {

  // Função auxiliar para determinar a cor do Badge com base no status
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
    <Card
      // TAMANHO FIXO: Altura definida e largura para ocupar 100% no container
      className="mb-3 w-full h-36"
    >
      <CardContent className="w-full h-full p-4 flex justify-between items-center">

        {/* Lado Esquerdo: Informações Principais e Descrição (FLEX GROW) */}
        <div className="flex flex-col justify-center space-y-1.5 overflow-hidden">

          {/* Endereço/Imóvel */}
          <h2 className="text-lg font-bold text-white truncate flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {pedido.imovel?.endereco || 'Imóvel Desconhecido'}
          </h2>

          {/* Solicitado Por */}
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <User className="w-3 h-3 text-gray-500" />
            Solicitado por: <span className="font-medium text-gray-200">{pedido.criadoPor.nome}</span>
          </p>

          {/* NOVO: Descrição do Pedido com limite de 2 linhas */}
          <p
            className="text-xs text-gray-400 mt-1.5 leading-tight line-clamp-2 text-ellipsis"
          >
            {pedido.descricao}
          </p>
          {/* FIM NOVO */}

        </div>

        {/* Lado Direito: Status em Badge (FLEX SHRINK) */}
        <div className="flex-shrink-0 self-start pt-1">
          <Badge
            className={`font-semibold text-sm px-3 py-1 ${getStatusColor(pedido.status)}`}
          >
            {pedido.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default CardPedido;