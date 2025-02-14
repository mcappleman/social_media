// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const { name, email, password, password_confirmation } = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      { user: { name, email, password, password_confirmation } }
    );
    const { token, refresh_token, user } = response.data;

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
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
