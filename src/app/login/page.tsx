import Image from "next/image";
import LoginForm from "../_components/loginForm";
import Link from "next/link";

const Login = async () => {

  return (
    <div className="flex flex-col items-center">
      <header className="">
        <Image
          height={18}
          width={120}
          alt="Imob-logo"
          src="/imob-logo.png"
          className="m-auto pt-8"
        />
      </header>

      <main className="text-center py-10">
        <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
        <p className="font-semibold text-gray-400">Acesse sua conta para gerenciar seus imóveis</p>
      </main>
      <LoginForm />

      <div className="text-center">
        <p className="font-semibold text-gray-400">Não tem uma conta? </p>
        <Link href="/cadastrar">
          <span className="text-primary">Cadastre-se</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;