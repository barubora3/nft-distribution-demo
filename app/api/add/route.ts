import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const address = data.address;

  try {
    await sql`INSERT INTO Users (address, created_at) VALUES (${address}, CURRENT_TIMESTAMP);`;

    return NextResponse.json("success");
  } catch (e) {
    console.log(e);
    return NextResponse.json("error");
  }
}
