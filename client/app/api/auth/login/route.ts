// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Replace with your Rails API URL from environment variables.
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      { email, password }
    );
    const { token, refresh_token, user } = response.data;

    // Create HTTP-only cookies for access and refresh tokens.
    const tokenCookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });
    const refreshCookie = serialize("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const res = NextResponse.json({ success: true, user });
    // Append multiple Set-Cookie headers
    res.headers.append("Set-Cookie", tokenCookie);
    res.headers.append("Set-Cookie", refreshCookie);
    return res;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
