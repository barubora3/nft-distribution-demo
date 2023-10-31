import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const address = data.address;

  try {
    const result = await prisma.request.create({
      data: {
        address: address,
        created_at: new Date(),
      },
    });
    console.log(result);

    return NextResponse.json(
      { message: address + " registered" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}
