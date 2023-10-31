import { NextResponse } from "next/server";
import { db, sql } from "@vercel/postgres";

export async function GET() {
  try {
    // const client = await db.connect();
    // const result = await client.query(
    //   "SELECT * FROM Request ORDER BY created_at DESC;"
    // );
    const result = await sql`SELECT * FROM Request ORDER BY created_at DESC;`;

    return NextResponse.json({ records: result.rows });
  } catch (e) {
    console.log(e);
    return NextResponse.json("error");
  }
}
