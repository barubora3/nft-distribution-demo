import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const runtime = "edge";

export async function GET() {
  let result;
  try {
    result = await prisma.request.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    console.log(result);
    return NextResponse.json(
      { records: result },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}
