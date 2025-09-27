import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "../../_components/header";

const Imoveis = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center">
      <Header />
      <h1>Home Page</h1>
      <h2>Olá, </h2>
    </div>
  );
}

export default Imoveis;


// id, endereco, valoCompra, valorVenda, status, engenhieroId
