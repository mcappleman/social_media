// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { parse, serialize } from "cookie";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    // Call your Rails refresh endpoint (passing the refresh token via header)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
      null,
      { headers: { "X-Refresh-Token": refreshToken } }
    );
    const { token, refresh_token } = response.data;

    const tokenCookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });
    const refreshCookie = serialize("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const res = NextResponse.json({ success: true });
    res.headers.append("Set-Cookie", tokenCookie);
    res.headers.append("Set-Cookie", refreshCookie);
    return res;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Could not refresh token" }, { status: 401 });
  }
}
