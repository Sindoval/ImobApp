"use client"

import { redirect, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

const LogoutButton = () => {
  const router = useRouter();


  const handleLogout = async () => {
    const res = await fetch("/api/users/logout", { method: "POST" });
    if (res.ok) {
      router.push("/login");
    } else {
      console.error("Falha ao deslogar")
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
    >
      <LogOutIcon />
      Sair da conta</Button>
  );
}

export default LogoutButton;