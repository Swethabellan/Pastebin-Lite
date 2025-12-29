import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body as {
    content?: unknown;
    ttl_seconds?: unknown;
    max_views?: unknown;
  };

  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "content is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  let ttlSeconds: number | null = null;
  if (ttl_seconds !== undefined) {
    if (
      typeof ttl_seconds !== "number" ||
      !Number.isInteger(ttl_seconds) ||
      ttl_seconds < 1
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1 when provided" },
        { status: 400 }
      );
    }
    ttlSeconds = ttl_seconds;
  }

  let maxViews: number | null = null;
  if (max_views !== undefined) {
    if (
      typeof max_views !== "number" ||
      !Number.isInteger(max_views) ||
      max_views < 1
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1 when provided" },
        { status: 400 }
      );
    }
    maxViews = max_views;
  }

  const paste = await prisma.paste.create({
    data: {
      content,
      ttlSeconds: ttlSeconds ?? undefined,
      maxViews: maxViews ?? undefined,
      remainingViews: maxViews ?? undefined,
    },
    select: {
      id: true,
    },
  });

  const id = paste.id;
  
  // Get the origin from the request headers
  const url = new URL(request.url);
  const origin = url.origin;
  const pasteUrl = `${origin}/p/${id}`;

  return NextResponse.json(
    {
      id,
      url: pasteUrl,
    },
    { status: 201 }
  );
}


