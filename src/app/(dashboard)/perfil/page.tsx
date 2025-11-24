import Header from "@/app/_components/header";
import PerfilClient from "@/app/_components/perfil-client";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { UserComRole } from "@/app/_types/estoque";
import { useEffect, useState } from "react";

const Perfil = () => {

  return (
    <div className="flex flex-col items-center h-screen">
      <Header />
      <h1 className="text-2xl font-bold text-gray-200 py-3">Perfil</h1>
      <hr className="w-full" />
      <PerfilClient />
    </div>
  );
}

export default Perfil;