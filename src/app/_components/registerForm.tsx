"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório"),
  email: z.string().nonempty("O email é obrigatório").email(),
  senha: z.string().nonempty("A senha é obrigatória").min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmarSenha: z.string().nonempty("confirme sua senha"),
  role: z.enum(["investidor", "engenheiro", "financeiro"], { message: "Escolha uma função" })
}).refine((data) => data.confirmarSenha === data.senha, {
  path: ["confirmarSenha"],
  message: "As senhas não conferem",
});

function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      role: "investidor"
    },
  });

  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })

      if (res.ok) {
        await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            senha: values.senha,
          })
        });

        router.push("/imoveis");
      }

    } catch (error) {
      console.log("Falha ao cadastrar o usuário:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="w-[80%] flex flex-col gap-1 mb-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="confirmarSenha"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Função</FormLabel>
              {/* REMOVA O FormControl DAQUI */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={field.value === "investidor"}
                    onChange={() => field.onChange("investidor")} />
                  Investidor
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={field.value === "engenheiro"}
                    onChange={() => field.onChange("engenheiro")} />
                  Engenheiro
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={field.value === "financeiro"}
                    onChange={() => field.onChange("financeiro")} />
                  Financeiro
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )} />
        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;