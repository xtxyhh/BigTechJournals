"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Search, Shield, UserX } from "lucide-react";

type Role = "ADMIN" | "EDITOR" | "WRITER" | "USER" | "VIEWER" | "SUPER_ADMIN";
type User = { id: string; name: string | null; email: string; role: Role; banned: boolean; createdAt: string; _count?: { comments: number; likes: number; bookmarks: number } };
const roles: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "WRITER", "USER"];
const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05]";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/users").then((res) => (res.ok ? res.json() : [])).then(setUsers);
  }, []);

  const filtered = useMemo(() => users.filter((user) => `${user.name ?? ""} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())), [users, query]);

  const patchUser = async (id: string, data: Partial<User>) => {
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) });
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...data } : user)));
  };

  return (
    <div className="space-y-5">
      <div className={`${panel} flex items-center gap-3 p-3`}>
        <Search className="ml-2 h-4 w-4 text-white/35" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35" />
      </div>

      <div className={`${panel} overflow-x-auto`}>
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-white/45">
            <tr className="border-b border-white/[0.08]"><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Activity</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-white/[0.06] last:border-0">
                <td className="p-4"><p className="font-medium text-white">{user.name ?? "Unnamed"}</p><p className="text-xs text-white/40">{user.email}</p></td>
                <td className="p-4">
                  <select value={user.role} onChange={(event) => patchUser(user.id, { role: event.target.value as Role })} className="rounded-xl border border-white/[0.08] bg-[#080d1f] px-3 py-2 text-white">
                    {roles.map((role) => <option key={role} value={role}>{role === "WRITER" ? "AUTHOR" : role}</option>)}
                  </select>
                </td>
                <td className="p-4 text-white/55">{user._count?.comments ?? 0} comments · {user._count?.likes ?? 0} likes</td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs ${user.banned ? "bg-red-500/20 text-red-100" : "bg-emerald-500/20 text-emerald-100"}`}>{user.banned ? "Disabled" : "Enabled"}</span></td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button title={user.banned ? "Enable user" : "Disable user"} onClick={() => patchUser(user.id, { banned: !user.banned })} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white"><UserX className="h-4 w-4" /></button>
                    <button title="Disable user" onClick={() => patchUser(user.id, { banned: true })} className="rounded-xl p-2 text-red-200 hover:bg-red-500/10"><Ban className="h-4 w-4" /></button>
                    <button title="Set admin" onClick={() => patchUser(user.id, { role: "ADMIN" })} className="rounded-xl p-2 text-blue-200 hover:bg-blue-500/10"><Shield className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
