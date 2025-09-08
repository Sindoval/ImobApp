import { cookies } from "next/headers";
import LogoutButton from "../_components/logoutButton";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return redirect("/login")
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Home Page</h1>
      <h2>Olá, </h2>
      <LogoutButton />
    </div>
  );
}

export default HomePage;