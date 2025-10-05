import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado" });

  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
  })
  revalidatePath("/login");
  return response;
}