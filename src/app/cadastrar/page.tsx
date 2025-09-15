import RegisterForm from "../_components/registerForm";
import Header from "../_components/header";

const Cadastrar = () => {
  return (
    <div className="flex flex-col items-center">
      <Header />

      <main className="text-center py-10">
        <h1 className="text-2xl font-bold">Crie sua conta</h1>
        <p className="font-semibold text-gray-400">Acesse sua conta para gerenciar seus imóveis</p>
      </main>
      <RegisterForm />
    </div>
  );
}

export default Cadastrar;