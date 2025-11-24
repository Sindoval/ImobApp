"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email(),
  senha: z
    .string()
    .nonempty("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: ""
    },
  })

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    })

    if (res.ok) {
      router.push("/dashboard")
    } else {
      toast.error("Email ou senha incorretos")
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-[80%] h-[300px] flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-7">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <div className="flex justify-end pt-0 pb-2">
                <Link href="/recuperar-senha">
                  <span className="text-primary">Recuperara senha</span>
                </Link>
              </div>
            </FormItem>

          )}
        />
        <Button
          type="submit"
          className="w-[100%]"
        >Entrar</Button>
      </form>
    </Form>
  )
}

export default LoginForm;