import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function GET() {
  const token = cookies().get("token")?.value;

  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}