import { NextResponse } from "next/server";
import { COOKIE_AKSES, UMUR_COOKIE, kodeValid } from "@/lib/akses";

export async function POST(request) {
  const form = await request.formData();
  const kode = String(form.get("kode") || "").trim();

  if (!kodeValid(kode)) {
    return NextResponse.redirect(new URL("/masuk?galat=1", request.url), 303);
  }

  const res = NextResponse.redirect(new URL("/", request.url), 303);
  res.cookies.set(COOKIE_AKSES, kode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UMUR_COOKIE,
  });
  return res;
}
