"use client"

import { Avatar } from "@radix-ui/react-avatar";
import { SheetContent, SheetFooter } from "./ui/sheet";
import { AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CircleChevronLeft, Home, UsersRound, Warehouse } from "lucide-react";
import LogoutButton from "./logoutButton";

interface User {
  nome: string,
  email: string
}

const SidebarButton = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch("/api/users/me");
      const data = await user.json();
      setUser(data.user);
    }
    fetchUser();
  }, []);

  return (
    <SheetContent className="flex flex-col h-full">
      <div className="flex-col">

        {/* Avatar e Email */}
        <div className="w-full flex-col items-center justify-center mx-auto border-b border-solid py-5 text-center mb-10">
          <Avatar>
            <AvatarImage src="/avatar.jpg" className="w-32 rounded-full mx-auto" />
          </Avatar>
          <div className="py-5">
            <h1 className="font-bold text-2xl">Olá, {user?.nome}!</h1>
            <p className="font-semibold text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <div>
          <Button className="w-full justify-start" variant="ghost" asChild >
            <Link href="/dashboard">
              <CircleChevronLeft /> Inicio
            </Link>
          </Button>

          <Button className="w-full justify-start" variant="ghost" asChild >
            <Link href="/imoveis">
              <Home /> Meus Imóveis
            </Link>
          </Button>

          <Button className="w-full justify-start" variant="ghost" asChild >
            <Link href="/estoque">
              <Warehouse /> Estoque
            </Link>
          </Button>

          <Button className="w-full justify-start" variant="ghost" asChild >
            <Link href="/perfil">
              <UsersRound /> Perfil
            </Link>
          </Button>

        </div>

      </div>
      <SheetFooter className="mt-auto">
        <LogoutButton />
      </SheetFooter>
    </SheetContent>
  );
}

export default SidebarButton;