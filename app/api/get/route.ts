import { NextResponse } from "next/server";
import { db, sql, createClient } from "@vercel/postgres";

export async function GET() {
  const client = createClient();
  await client.connect();
  let result;
  try {
    result = await client.sql`SELECT * FROM Request ORDER BY created_at DESC;`;
    // const result = await sql`SELECT * FROM Request ORDER BY created_at DESC;`;

    await client.end();
    return NextResponse.json(
      { records: result.rows },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error(e);
    await client.end();
    return NextResponse.json({ e }, { status: 500 });
  }
}
