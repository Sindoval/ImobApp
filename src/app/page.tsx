import Image from "next/image";
import { Button } from "./_components/ui/button";
import { FileCode2, HardHat, Hotel, LockKeyholeOpen, UsersRound } from "lucide-react";
import { Card, CardContent } from "./_components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="">
        <Image
          height={18}
          width={120}
          alt="Imob-logo"
          src="/imob-logo.png"
          className="m-auto pt-8"
        />
      </header>
      <main className="flex-col items-center w-[90%] mx-auto">
        {/* Mensagens */}
        <div className="my-5  text-center">
          <h1 className="text-3xl text-primary font-bold ">O seu Gestor de Imóveis Simplificado!</h1>

          <h3 className="my-5 text-gray-400 font-semibold">Gerencie seus imóveis e inquilinos de forma simples e eficiente. Tudo em um só lugar, acessível para todos.</h3>

          <h2 className="text-xl font-bold my-8">Descubra Nossos Recursos</h2>
        </div>

        {/* CARDS */}
        <div className="mb-6 flex justify-center gap-5 flex-wrap">
          <Card className="w-[45%] h-[280px] flex-col">
            <CardContent className="p-3">
              <Hotel className="text-primary mb-3" width={28} height={28} />


              <p className="text-sm font-semibold mb-2">Cadastro de Imóveis</p>
              <p className="text-sm text-gray-400">Cadastre seus imóveis com todas as informações necessárias.</p>
              <p className="text-sm text-gray-400">Adicione endereço, características, fotos e documentos de cada imóvel de forma organizada.</p>
            </CardContent>
          </Card>

          <Card className="w-[45%] h-[280px] flex-col">
            <CardContent className="p-3">
              <UsersRound className="text-primary mb-3" width={28} height={28} />


              <p className="text-sm font-semibold mb-2">Gestão de Inquilinos</p>
              <p className="text-sm text-gray-400">Vincule inquilinos aos imóveis e gerencie contratos.</p>
              <p className="text-sm text-gray-400">Mantenha os dados dos inquilinos atualizados e acompanhe o histórico de ocupação dos imóveis.</p>
            </CardContent>
          </Card>

          <Card className="w-[45%] h-[280px] flex-col">
            <CardContent className="p-3">
              <FileCode2 className="text-primary mb-3" width={28} height={28} />


              <p className="text-sm font-semibold mb-2">Documentos & Contratos</p>
              <p className="text-sm text-gray-400">Imprima contratos, boletos e documentos essenciais diretamente pelo app, com facilidade.</p>
            </CardContent>
          </Card>

          <Card className="w-[45%] h-[280px] flex-col">
            <CardContent className="p-3">
              <HardHat className="text-primary mb-3" width={28} height={28} />


              <p className="text-sm font-semibold mb-2">Pedidos de Materiais</p>
              <p className="text-sm text-gray-400">Faça e acompanhe pedidos de materiais para reformas rapidamente, sem perder o controle.</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mb-10">
          <Link href="/login">
            <Button className="w-[90%] ">
              <LockKeyholeOpen />Entrar ou Cadastrar-se
            </Button>
          </Link>
        </div>
      </main>
      <footer>
        <Card className="md:mt-20">
          <CardContent className="px-5 py-6 text-center">
            <p className="text-sm text-gray-400">© 2025 Copyright <span className="font-bold">Imob.</span></p>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
