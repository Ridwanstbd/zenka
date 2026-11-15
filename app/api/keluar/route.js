import { NextResponse } from "next/server";
import { COOKIE_AKSES } from "@/lib/akses";

export async function POST(request) {
  const res = NextResponse.redirect(new URL("/masuk", request.url), 303);
  res.cookies.set(COOKIE_AKSES, "", { path: "/", maxAge: 0 });
  return res;
}
