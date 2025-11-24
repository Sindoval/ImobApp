import Header from "../_components/header";
import RecuperarSenhaClient from "../_components/recuperar-senha-client";

const RecuperarSenha = () => {
  return (
    <div className="flex-col h-full items-center">
      <Header />
      <RecuperarSenhaClient />
    </div>
  );
}

export default RecuperarSenha;