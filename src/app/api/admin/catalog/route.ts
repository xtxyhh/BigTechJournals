import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema, companySchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const type = request.nextUrl.searchParams.get("type");

    if (type === "companies") {
      return NextResponse.json(await db.company.findMany({ orderBy: { name: "asc" } }));
    }
    return NextResponse.json(await db.category.findMany({ orderBy: { name: "asc" } }));
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { type, ...data } = body;

    if (type === "company") {
      const parsed = companySchema.safeParse(data);
      if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      const company = await db.company.create({
        data: {
          ...parsed.data,
          interviewProcess: parsed.data.interviewProcess as Prisma.InputJsonValue,
          roadmap: parsed.data.roadmap as Prisma.InputJsonValue,
          resources: parsed.data.resources as Prisma.InputJsonValue,
          salaryInfo: parsed.data.salaryInfo as Prisma.InputJsonValue,
          faqs: parsed.data.faqs as Prisma.InputJsonValue,
        },
      });
      return NextResponse.json(company, { status: 201 });
    }

    const parsed = categorySchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const category = await db.category.create({ data: parsed.data });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { type, id, ...data } = body;

    if (type === "company") {
      const company = await db.company.update({ where: { id }, data });
      return NextResponse.json(company);
    }

    const category = await db.category.update({ where: { id }, data });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const type = request.nextUrl.searchParams.get("type");
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (type === "company") {
      await db.company.delete({ where: { id } });
    } else {
      await db.category.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
