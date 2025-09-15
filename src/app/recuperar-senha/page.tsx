"use client"

import { useState } from "react";
import Header from "../_components/header";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "codigo" | "senha">("email");
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  // Etapa 1: Enviar email
  const handleEnviarEmail = async () => {
    const res = await fetch("/api/users/recover", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error("Não foi possível encontrar esse usuário")
    } else {
      toast.success(data.message);
      setStep("codigo");
    }
  };

  // Etapa 2: Verificar código
  const handleVerificarCodigo = async () => {
    const res = await fetch("/api/users/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, token: codigo }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
    } else {
      toast.success("Agora crie sua nova senha.")
      setStep("senha");
    }
  };

  // Etapa 3: Redefinir senha
  const handleRedefinirSenha = async () => {
    const res = await fetch("/api/users/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token: codigo, newPassword: senha }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error)
    } else {
      toast.success("Senha alterada com sucesso!! Agora você já pode fazer login.")
      setStep("email"); // volta pro início do fluxo
      setEmail("");
      setCodigo("");
      setSenha("");
      router.push("/login");
    }
  };

  return (
    <div className="flex-col h-full items-center">
      <Header />
      <main className="h-[70%] w-[80%] mt-20  mx-auto">
        <div className="h-[30%] flex-col">
          <h1 className="text-4xl font-bold text-gray-200 mb-5">Redefinição de senha!</h1>

          <h3 className="text-base font-semibold text-gray-400">
            {step === "email" &&
              "Informe seu email para receber um código de recuperação."}
            {step === "codigo" &&
              "Digite o código de verificação enviado ao seu e-mail."}
            {step === "senha" && "Agora crie sua nova senha."}
          </h3>
        </div>

        {step === "email" && (
          <div className="my-10">
            <p className="text-xl semi-bold pb-3">Email</p>
            <Input
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="my-5 w-full" onClick={handleEnviarEmail}>
              Enviar código
            </Button>
          </div>
        )}

        {/* Campo de código */}
        {step === "codigo" && (
          <div className="my-10">
            <p className="text-xl semi-bold pb-3">Código</p>
            <Input
              placeholder="Digite o código recebido"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <Button className="my-5 w-full" onClick={handleVerificarCodigo}>
              Verificar código
            </Button>
          </div>
        )}

        {/* Campo de nova senha */}
        {step === "senha" && (
          <div className="my-10">
            <p className="text-xl semi-bold pb-3">Nova senha</p>
            <Input
              placeholder="********"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Button className="my-5 w-full" onClick={handleRedefinirSenha}>
              Alterar senha
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default RecuperarSenha;