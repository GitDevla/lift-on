import { readFile } from "node:fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "node:path";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path: asd } = await params;
    const filePath = path.join(process.env.DYNAMIC_IMAGES_DIR as string, ...asd);
    try {
        const data = await readFile(filePath);
        return new NextResponse(data, {
            headers: {
                "Content-Type": "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not found", { status: 404 });
    }
}
