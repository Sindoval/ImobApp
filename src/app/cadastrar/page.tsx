import Image from "next/image";
import RegisterForm from "../_components/registerForm";

const Cadastrar = () => {
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
        <h1 className="text-2xl font-bold">Crie sua conta</h1>
        <p className="font-semibold text-gray-400">Acesse sua conta para gerenciar seus imóveis</p>
      </main>
      <RegisterForm />

    </div>
  );
}

export default Cadastrar;