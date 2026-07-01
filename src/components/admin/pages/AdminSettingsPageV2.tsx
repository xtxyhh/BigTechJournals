"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

type LinkItem = { id?: string; label: string; href: string; group?: string; external?: boolean };
type Settings = {
  heroTitle?: string;
  heroSubtitle?: string;
  footerTagline?: string;
  favicon?: string;
  logo?: string;
  seoDefaultTitle?: string;
  seoDefaultDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  accentColor?: string;
  themeMode?: "dark" | "light" | "system";
  newsletterTitle?: string;
  newsletterDescription?: string;
  contactEmail?: string;
  contactPhone?: string | null;
  contactAddress?: string | null;
  socialLinkedin?: string | null;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
  copyright?: string;
  navItems?: LinkItem[];
  footerLinks?: LinkItem[];
};
type Toast = { id: number; type: "success" | "error"; message: string };

const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5";
const input = "w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50";

function TextField({ label, name, value, onChange, type = "text" }: { label: string; name: keyof Settings; value: string; onChange: (name: keyof Settings, value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/40">{label}</span>
      <input type={type} className={input} value={value} onChange={(event) => onChange(name, event.target.value)} />
    </label>
  );
}

function normalizeLinks(items?: LinkItem[]) {
  return (items ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    group: item.group,
    external: Boolean(item.external),
  }));
}

export default function AdminSettingsPageV2() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = (type: Toast["type"], message: string) => {
    const next = { id: Date.now(), type, message };
    setToast(next);
    window.setTimeout(() => {
      setToast((current) => (current?.id === next.id ? null : current));
    }, 3200);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/settings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to load settings");
        return data as Settings;
      })
      .then((data) => {
        if (!active) return;
        setSettings({ ...data, navItems: normalizeLinks(data.navItems), footerLinks: normalizeLinks(data.footerLinks) });
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        const message = loadError instanceof Error ? loadError.message : "Failed to load settings";
        setError(message);
        notify("error", message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setValue = (name: keyof Settings, value: string) => setSettings((current) => ({ ...current, [name]: value }));
  const addLink = (key: "navItems" | "footerLinks") => setSettings((current) => ({ ...current, [key]: [...normalizeLinks(current[key]), { label: "New item", href: "/", group: key === "footerLinks" ? "Platform" : undefined }] }));
  const updateLink = (key: "navItems" | "footerLinks", index: number, field: keyof LinkItem, value: string | boolean) => setSettings((current) => ({ ...current, [key]: normalizeLinks(current[key]).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)) }));
  const deleteLink = (key: "navItems" | "footerLinks", index: number) => setSettings((current) => ({ ...current, [key]: normalizeLinks(current[key]).filter((_, itemIndex) => itemIndex !== index) }));

  const validationError = () => {
    if (!settings.heroTitle?.trim()) return "Hero title is required.";
    if (!settings.heroSubtitle?.trim()) return "Tagline is required.";
    if (!settings.contactEmail?.includes("@")) return "A valid contact email is required.";
    if (settings.accentColor && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(settings.accentColor)) return "Accent color must be a hex value.";
    const invalidLink = [...normalizeLinks(settings.navItems), ...normalizeLinks(settings.footerLinks)].find((item) => !item.label.trim() || !item.href.trim());
    if (invalidLink) return "Navigation and footer links need both label and href.";
    return "";
  };

  const save = async () => {
    if (saving) return;
    const invalid = validationError();
    if (invalid) {
      setError(invalid);
      notify("error", invalid);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        ...settings,
        navItems: normalizeLinks(settings.navItems),
        footerLinks: normalizeLinks(settings.footerLinks),
      };
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to save settings");
      setSettings({ ...data, navItems: normalizeLinks(data.navItems), footerLinks: normalizeLinks(data.footerLinks) });
      notify("success", "Settings saved successfully.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to save settings";
      setError(message);
      notify("error", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`${panel} flex min-h-60 items-center justify-center gap-3 text-white/65`}>
        <Loader2 className="h-5 w-5 animate-spin text-blue-300" /> Loading settings...
      </div>
    );
  }

  const navItems = normalizeLinks(settings.navItems);
  const footerLinks = normalizeLinks(settings.footerLinks);

  return (
    <div className="space-y-5">
      {toast && (
        <div className={`fixed right-5 top-5 z-[80] flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${toast.type === "success" ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-100" : "border-red-400/25 bg-red-500/15 text-red-100"}`} role="status" aria-live="polite">
          {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>{error && <p className="text-sm text-red-300">{error}</p>}</div>
        <button onClick={save} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {saving ? "Saving..." : "Save settings"}
        </button>
      </div>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">General</h2>
        <TextField label="Hero title" name="heroTitle" value={settings.heroTitle ?? ""} onChange={setValue} />
        <TextField label="Tagline" name="heroSubtitle" value={settings.heroSubtitle ?? ""} onChange={setValue} />
        <TextField label="Description" name="footerTagline" value={settings.footerTagline ?? ""} onChange={setValue} />
        <TextField label="Favicon" name="favicon" value={settings.favicon ?? ""} onChange={setValue} />
        <div className="lg:col-span-2"><MediaUploader label="Logo" value={settings.logo ?? ""} onChange={(url) => setValue("logo", url)} /></div>
      </section>

      <section className={panel}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Navbar</h2>
          <button type="button" onClick={() => addLink("navItems")} className="rounded-xl bg-white/[0.06] p-2 text-white/70"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          {navItems.map((item, index) => (
            <div key={`${item.id ?? "new"}-${index}`} className="grid gap-2 rounded-2xl bg-black/20 p-3 sm:grid-cols-[auto_1fr_1fr_auto]">
              <GripVertical className="mt-3 h-4 w-4 text-white/35" />
              <input aria-label="Navigation label" className={input} value={item.label} onChange={(event) => updateLink("navItems", index, "label", event.target.value)} />
              <input aria-label="Navigation href" className={input} value={item.href} onChange={(event) => updateLink("navItems", index, "href", event.target.value)} />
              <button type="button" onClick={() => deleteLink("navItems", index)} className="rounded-xl p-2 text-red-200"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </section>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">SEO</h2>
        <TextField label="Meta title" name="seoDefaultTitle" value={settings.seoDefaultTitle ?? ""} onChange={setValue} />
        <TextField label="Keywords" name="seoKeywords" value={settings.seoKeywords ?? ""} onChange={setValue} />
        <label className="lg:col-span-2 block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/40">Meta description</span>
          <textarea className={input} rows={4} value={settings.seoDefaultDescription ?? ""} onChange={(event) => setValue("seoDefaultDescription", event.target.value)} />
        </label>
        <MediaUploader label="OG image" value={settings.ogImage ?? ""} onChange={(url) => setValue("ogImage", url)} />
      </section>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">Theme and Newsletter</h2>
        <TextField label="Accent color" name="accentColor" value={settings.accentColor ?? "#3b82f6"} onChange={setValue} type="color" />
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/40">Theme mode</span>
          <select className={input} value={settings.themeMode ?? "dark"} onChange={(event) => setValue("themeMode", event.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </label>
        <TextField label="Newsletter title" name="newsletterTitle" value={settings.newsletterTitle ?? ""} onChange={setValue} />
        <TextField label="Newsletter subtitle" name="newsletterDescription" value={settings.newsletterDescription ?? ""} onChange={setValue} />
      </section>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">Contact and Footer</h2>
        <TextField label="Email" name="contactEmail" value={settings.contactEmail ?? ""} onChange={setValue} />
        <TextField label="Phone" name="contactPhone" value={settings.contactPhone ?? ""} onChange={setValue} />
        <TextField label="Address" name="contactAddress" value={settings.contactAddress ?? ""} onChange={setValue} />
        <TextField label="LinkedIn" name="socialLinkedin" value={settings.socialLinkedin ?? ""} onChange={setValue} />
        <TextField label="X/Twitter" name="socialTwitter" value={settings.socialTwitter ?? ""} onChange={setValue} />
        <TextField label="Instagram" name="socialInstagram" value={settings.socialInstagram ?? ""} onChange={setValue} />
        <TextField label="Copyright" name="copyright" value={settings.copyright ?? ""} onChange={setValue} />
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">Quick Links</h3>
            <button type="button" onClick={() => addLink("footerLinks")} className="rounded-xl bg-white/[0.06] p-2 text-white/70"><Plus className="h-4 w-4" /></button>
          </div>
          <div className="space-y-2">
            {footerLinks.map((item, index) => (
              <div key={`${item.id ?? "new"}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <input aria-label="Footer label" className={input} value={item.label} onChange={(event) => updateLink("footerLinks", index, "label", event.target.value)} />
                <input aria-label="Footer href" className={input} value={item.href} onChange={(event) => updateLink("footerLinks", index, "href", event.target.value)} />
                <input aria-label="Footer group" className={input} value={item.group ?? "Platform"} onChange={(event) => updateLink("footerLinks", index, "group", event.target.value)} />
                <button type="button" onClick={() => deleteLink("footerLinks", index)} className="rounded-xl p-2 text-red-200"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
