import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { internshipSchema, resourceSchema, roadmapSchema } from "@/lib/validations";
import { nullableString, parseTags } from "@/lib/platform-content";

type AdminContentKind = "resources" | "internships" | "roadmaps";

const schemaByKind = {
  resources: resourceSchema,
  internships: internshipSchema,
  roadmaps: roadmapSchema,
} satisfies Record<AdminContentKind, z.ZodType>;

function normalize(kind: AdminContentKind, body: Record<string, unknown>) {
  const parsed = schemaByKind[kind].parse({
    ...body,
    tags: parseTags(body.tags),
    sortOrder: Number(body.sortOrder ?? 0),
  });

  const base = {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    coverImage: nullableString(parsed.coverImage),
    authorName: nullableString(parsed.authorName),
    companyId: nullableString(parsed.companyId),
    difficulty: nullableString(parsed.difficulty),
    timeRequired: nullableString(parsed.timeRequired),
    tags: parsed.tags,
    featured: parsed.featured,
    published: parsed.published,
    sortOrder: parsed.sortOrder,
    seoTitle: nullableString(parsed.seoTitle),
    seoDescription: nullableString(parsed.seoDescription),
  };

  if (kind === "resources") {
    const resource = parsed as z.infer<typeof resourceSchema>;
    return {
      ...base,
      name: nullableString(resource.name) ?? resource.title,
      type: resource.type,
      url: resource.url,
      content: nullableString(resource.content),
    };
  }

  if (kind === "internships") {
    const internship = parsed as z.infer<typeof internshipSchema>;
    return {
      ...base,
      location: nullableString(internship.location),
      remote: internship.remote,
      stipend: nullableString(internship.stipend),
      deadline: internship.deadline ? new Date(internship.deadline) : null,
      applyUrl: nullableString(internship.applyUrl),
    };
  }

  const roadmap = parsed as z.infer<typeof roadmapSchema>;
  return {
    ...base,
    role: nullableString(roadmap.role),
    nodes: roadmap.nodes as Prisma.InputJsonValue,
  };
}

export function createAdminPlatformHandlers(kind: AdminContentKind) {
  const model = (kind === "resources" ? db.resource : kind === "internships" ? db.internship : db.roadmap) as {
    findMany: (args: unknown) => Promise<unknown[]>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };

  return {
    async GET() {
      try {
        await requireAdmin();
        const items = await model.findMany({
          include: { company: { select: { id: true, name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
        return NextResponse.json(items);
      } catch {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    },

    async POST(request: NextRequest) {
      try {
        await requireAdmin();
        const body = await request.json();
        const item = await model.create({ data: normalize(kind, body) });
        return NextResponse.json(item, { status: 201 });
      } catch (error) {
        const message = error instanceof z.ZodError ? error.issues[0]?.message ?? "Invalid content" : "Failed to create content";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    },

    async PATCH(request: NextRequest) {
      try {
        await requireAdmin();
        const body = await request.json();
        if (typeof body.id !== "string") return NextResponse.json({ error: "Missing id" }, { status: 400 });
        const item = await model.update({ where: { id: body.id }, data: normalize(kind, body) });
        return NextResponse.json(item);
      } catch (error) {
        const message = error instanceof z.ZodError ? error.issues[0]?.message ?? "Invalid content" : "Failed to update content";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    },

    async DELETE(request: NextRequest) {
      try {
        await requireAdmin();
        const id = request.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
        await model.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    },
  };
}
