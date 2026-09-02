import { NextResponse } from "next/server";
import sharp from "sharp";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Formulário inválido" }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });

  const urls: string[] = [];
  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Formato de imagem não suportado" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Cada imagem deve ter até 8MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(buffer)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 76 })
      .toBuffer();

    urls.push(`data:image/webp;base64,${optimized.toString("base64")}`);
  }

  return NextResponse.json({ urls });
}
