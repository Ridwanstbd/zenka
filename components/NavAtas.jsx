import Link from "next/link";

export default function NavAtas() {
  return (
    <nav className="navatas" aria-label="Navigasi">
      <Link href="/" className="merek">zenka</Link>
      <form method="POST" action="/api/keluar">
        <button type="submit" className="alt">Keluar</button>
      </form>
    </nav>
  );
}
