// Penjaga pintu Zenka. Berjalan di server sebelum halaman mana pun dibuka.
// Satu kali masuk berlaku untuk semua tool, karena semuanya satu domain.
import { NextResponse } from "next/server";
import { COOKIE_AKSES, kodeValid } from "@/lib/akses";

const TERBUKA = ["/masuk", "/api/masuk"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (TERBUKA.includes(pathname)) return NextResponse.next();

  const kode = request.cookies.get(COOKIE_AKSES)?.value;
  if (kodeValid(kode)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { galat: "Butuh kode akses. Masuk dulu." },
      { status: 401 },
    );
  }
  return NextResponse.redirect(new URL("/masuk", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
