import { NextRequest, NextResponse } from "next/server";
import { globalSearch } from "@/lib/stories";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await globalSearch(q);
  return NextResponse.json(results);
}
