import { NextResponse } from "next/server";
import { getAllCompanies } from "@/lib/companies";

export async function GET() {
  const companies = await getAllCompanies();
  return NextResponse.json(companies);
}
