import LoginForm from "../_components/loginForm";
import Link from "next/link";
import Header from "../_components/header";

const Login = async () => {

  return (
    <div className="flex flex-col items-center">
      <Header />

      <main className="text-center py-10">
        <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
        <p className="font-semibold text-gray-400">Acesse sua conta para gerenciar seus imóveis</p>
      </main>
      <LoginForm />

      <div className="text-center flex gap-20">
        <div>
          <p className="font-semibold text-gray-400">Não tem conta? </p>
          <Link href="/cadastrar">
            <span className="text-primary">Cadastre-se</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;