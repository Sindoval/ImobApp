"use client"

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/users/logout", { method: "POST" });
    if (res.ok) {
      router.push("/login")
    } else {
      console.error("Falha ao deslogar")
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
    >Sair</Button>
  );
}

export default LogoutButton;