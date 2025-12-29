import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentTimeMs } from "@/lib/time";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const nowMs = getCurrentTimeMs(request);
  const createdMs = paste.createdAt.getTime();

  if (paste.ttlSeconds != null) {
    const expiresMs = createdMs + paste.ttlSeconds * 1000;
    if (nowMs >= expiresMs) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  if (paste.maxViews != null && paste.remainingViews != null) {
    if (paste.remainingViews <= 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  // All constraints pass; count this as a view if we have a view limit
  let remainingViews: number | null = null;
  if (paste.maxViews != null && paste.remainingViews != null) {
    const nextRemaining = paste.remainingViews - 1;
    await prisma.paste.update({
      where: { id },
      data: {
        remainingViews: nextRemaining,
      },
    });
    remainingViews = nextRemaining;
  }

  let expiresAt: string | null = null;
  if (paste.ttlSeconds != null) {
    const expiresMs = createdMs + paste.ttlSeconds * 1000;
    expiresAt = new Date(expiresMs).toISOString();
  }

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: expiresAt,
    },
    { status: 200 }
  );
}


