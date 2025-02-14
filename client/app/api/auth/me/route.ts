// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    // Ensure process.env.JWT_SECRET matches the Rails secret key used to sign tokens.
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({ user: decoded });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
