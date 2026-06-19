import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import type { Role } from "@prisma/client";

export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  if (user.banned) throw new Error("Account suspended");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function syncUserFromClerk() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const adminEmails = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const role: Role = adminEmails.includes(email.toLowerCase()) ? "ADMIN" : "USER";

  return db.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? null,
      image: clerkUser.imageUrl ?? null,
      role,
    },
    update: {
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? null,
      image: clerkUser.imageUrl ?? null,
    },
  });
}
