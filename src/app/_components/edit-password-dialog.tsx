import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordInput } from "./password-input";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface EditPasswordDialogProp {
  id: string | undefined
  isDialogOpen: boolean
  handleDialogOpen: (isOpen: boolean) => void
}

const EditPasswordDialog = ({ id, isDialogOpen, handleDialogOpen }: EditPasswordDialogProp) => {
  const [infoUser, setInfoUser] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const router = useRouter();

  const resetInfo = () => {
    setInfoUser({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    });
  }

  const passwordUpdate = async () => {

    if (infoUser.newPassword !== infoUser.confirmNewPassword) {
      toast.error("Por favor, verifique o valor fornecido no campo de confirmação");
      return;
    }

    const payload: ChangePasswordPayload = {
      currentPassword: infoUser.currentPassword,
      newPassword: infoUser.newPassword
    }

    try {
      const res = await fetch(`/api/users/${id}/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`${data.error}` || "Erro ao alterar Senha");
        resetInfo();
        return;
      }

      toast.success("Senha Atualizada com Sucesso!")
      handleDialogOpen(false);
      resetInfo();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao Atualizar Senha");
    }

  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="w-[90%]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">
            Alterar Senha
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-1 py-1">
            <p>Senha Atual</p>
            <PasswordInput
              value={infoUser.currentPassword}
              onChange={(e) => setInfoUser({ ...infoUser, currentPassword: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-1">
            <p>Nova Senha</p>
            <PasswordInput
              value={infoUser.newPassword}
              onChange={(e) => setInfoUser({ ...infoUser, newPassword: e.target.value })}
            />
          </div>
          <div className="space-y-1 py-1">
            <p>Confirmar nova Senha</p>
            <PasswordInput
              value={infoUser.confirmNewPassword}
              onChange={(e) => setInfoUser({ ...infoUser, confirmNewPassword: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 mt-4">
          <Button
            onClick={() => passwordUpdate()}
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

export default EditPasswordDialog;