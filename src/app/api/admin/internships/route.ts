import { createAdminPlatformHandlers } from "@/lib/admin-platform-crud";

const handlers = createAdminPlatformHandlers("internships");

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
