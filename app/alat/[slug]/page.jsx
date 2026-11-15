import { notFound } from "next/navigation";
import NavAtas from "@/components/NavAtas";
import FormAlat from "@/components/FormAlat";
import { TOOLS, cariTool, cariCabang } from "@/lib/tools";

export function generateStaticParams() {
  return TOOLS.filter((t) => t.siap).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const tool = cariTool((await params).slug);
  return { title: tool ? `Zenka: ${tool.judul}` : "Zenka" };
}

export default async function HalamanAlat({ params }) {
  const tool = cariTool((await params).slug);
  if (!tool || !tool.siap) notFound();

  return (
    <>
      <header className="kepala">
        <NavAtas />
        <p className="jejak">{cariCabang(tool.cabang)?.judul}</p>
        <h1>{tool.judul}</h1>
        <p>{tool.ringkas} Prompt tersusun di samping, siap disalin ke ChatGPT, Gemini, atau Claude.</p>
      </header>
      <FormAlat tool={tool} />
    </>
  );
}
