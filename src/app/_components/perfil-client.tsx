"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Lock, LogOutIcon, Mail, Phone, UserRoundPen } from "lucide-react";
import { useRouter } from "next/navigation";

import EditPerfilDialog from "./edit-perfil-dialog";
import EditPasswordDialog from "./edit-password-dialog";

interface User {
  id: string
  nome: string,
  email: string,
  role: string
}

const PerfilClient = () => {
  const [user, setUser] = useState<User | null>();
  const [isDialogPerfil, setIsDialogPerfil] = useState(false);
  const [isDialogPassword, setIsDialogPasswword] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch("/api/users/me");
      const data = await user.json();
      setUser(data.user);
    }
    fetchUser();
  }, []);

  const handlePerfilDialog = (isOpen: boolean) => {
    setIsDialogPerfil(isOpen);
  }
  const handlePasswordDialog = (isOpen: boolean) => {
    setIsDialogPasswword(isOpen);
  }

  const handleUser = (newUser: User) => {
    setUser(newUser);
  }


  const handleLogout = async () => {
    const res = await fetch("/api/users/logout", { method: "POST" });
    if (res.ok) {
      router.push("/login");
    } else {
      console.error("Falha ao deslogar")
    }
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-[30%] flex flex-col items-center mt-3">
        <Avatar className="w-36 h-36 ">
          <AvatarImage src="/avatar.jpg" className="rounded-full mx-auto" />
        </Avatar>
        <h1 className="text-xl font-bold text-gray-200 mt-2">{user?.nome}</h1>
        <p className="font-semibold text-gray-400">{user?.role}</p>

        <Card className="border-none w-[85%] mt-5">
          <CardContent className="h-40 p-3">
            <h2 className="text-base font-bold text-gray-200 mt-2">Informações de Contato</h2>
            <p className="flex gap-2 mt-2 text-gray-400"><Mail /> {user?.email}</p>

            <hr className="my-3" />

            <p className="flex gap-2 text-gray-400"><Phone /> (61) 91234-4567</p>
          </CardContent>
        </Card>

        <Card className="border-none w-[85%] mt-2">
          <CardContent className="h-48 p-3">
            <h2 className="text-base font-bold text-gray-200 mt-2">Definições da Conta</h2>
            <a onClick={() => console.log("aaaaaa")
            }>
              <p
                className="flex gap-2 mt-2 text-gray-200 "
                onClick={() => setIsDialogPerfil(true)}
              >
                <UserRoundPen className="text-primary" /> Editar Perfil</p>
            </a>

            <hr className="my-3" />

            <a onClick={() => setIsDialogPasswword(true)}>
              <p className="flex gap-2"><Lock className="text-primary" /> Alterar Senha</p>
            </a>

            <hr className="my-3" />

            <a onClick={() => handleLogout()}>
              <p className="flex gap-2" ><LogOutIcon className="text-destructive" /> Sair</p>
            </a>
          </CardContent>
        </Card>
      </div>
      <EditPerfilDialog
        isDialogOpen={isDialogPerfil}
        handleDialogOpen={handlePerfilDialog}
        user={user}
        handleUser={handleUser}
      />

      <EditPasswordDialog
        id={user?.id && user.id}
        isDialogOpen={isDialogPassword}
        handleDialogOpen={handlePasswordDialog}
      />
    </div>
  );
}

export default PerfilClient;