import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: string,
  nome: string,
  email: string,
  role: string
}

interface EditProfileDialogProp {
  isDialogOpen: boolean
  handleDialogOpen: (isOpen: boolean) => void
  user: User | null | undefined
  handleUser: (newUser: User) => void
}

const EditPerfilDialog = ({ isDialogOpen, handleDialogOpen, user, handleUser }: EditProfileDialogProp) => {
  const [infoUser, setInfoUser] = useState({
    nome: "",
    email: ""
  });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setInfoUser({
        nome: user?.nome,
        email: user?.email
      });
    }
  }, [user])

  const perfilUpdate = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const payload = {
      nome: infoUser.nome,
      email: infoUser.email
    }

    if (!emailRegex.test(infoUser.email)) {
      console.log("aaaaaaaaaa");
      toast.error("Por favor, forneça um Email válido.");
      return;
    }

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error("Erro ao editar Perfil")
        throw new Error(err?.message || "Erro ao criar pedido");
      }
      const updated: User = await res.json();
      handleUser(updated);

      toast.success("Perfil Atualizado com Sucesso!")
      handleDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao Atualizar Usuário");
    }

  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="w-[90%]">
        <DialogHeader>
          <DialogTitle>
            Atualizar Perfil
          </DialogTitle>
          <p className="text-sm text-gray-400">Faça alterações no seu perfil aqui. Clique em salvar quando terminar.</p>
        </DialogHeader>
        <div>
          <div className="space-y-1 py-2">
            <p>Nome</p>
            <Input
              value={infoUser.nome}
              onChange={(e) => setInfoUser({ ...infoUser, nome: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-2">
            <p>Email</p>
            <Input

              value={infoUser.email}
              onChange={(e) => setInfoUser({ ...infoUser, email: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 mt-4">
          <Button
            onClick={() => perfilUpdate()}
          >Salvar Alterações</Button>
          <Button
            variant="outline"
            onClick={() => handleDialogOpen(false)}
          >Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPerfilDialog;