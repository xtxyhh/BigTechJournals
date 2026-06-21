"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

type Settings = Record<string, string | boolean | undefined>;
type LinkItem = { id: string; label: string; href: string };
const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5";
const input = "w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50";

function TextField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (name: string, value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/40">{label}</span>
      <input className={input} value={value} onChange={(event) => onChange(name, event.target.value)} />
    </label>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [menuItems, setMenuItems] = useState<LinkItem[]>([
    { id: "stories", label: "Stories", href: "/stories" },
    { id: "submit", label: "Submit", href: "/submit" },
  ]);
  const [footerLinks, setFooterLinks] = useState<LinkItem[]>([
    { id: "contact", label: "Contact", href: "/contact" },
    { id: "profile", label: "Profile", href: "/profile" },
  ]);

  useEffect(() => {
    fetch("/api/settings").then((res) => (res.ok ? res.json() : {})).then(setSettings);
  }, []);

  const setValue = (name: string, value: string) => setSettings((current) => ({ ...current, [name]: value }));
  const addLink = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>) => setter((current) => [...current, { id: crypto.randomUUID(), label: "New item", href: "/" }]);
  const updateLink = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, id: string, key: "label" | "href", value: string) => setter((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  const deleteLink = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, id: string) => setter((current) => current.filter((item) => item.id !== id));

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) setSettings(await res.json());
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save settings"}
        </button>
      </div>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">General</h2>
        <TextField label="Site Name" name="siteName" value={(settings.siteName as string) ?? "BigTechJournals"} onChange={setValue} />
        <TextField label="Tagline" name="heroSubtitle" value={(settings.heroSubtitle as string) ?? ""} onChange={setValue} />
        <TextField label="Description" name="footerTagline" value={(settings.footerTagline as string) ?? ""} onChange={setValue} />
        <TextField label="Favicon" name="favicon" value={(settings.favicon as string) ?? ""} onChange={setValue} />
        <div className="lg:col-span-2"><MediaUploader label="Logo" value={(settings.logo as string) ?? ""} onChange={(url) => setValue("logo", url)} /></div>
      </section>

      <section className={panel}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Navbar</h2>
          <button onClick={() => addLink(setMenuItems)} className="rounded-xl bg-white/[0.06] p-2 text-white/70"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="grid gap-2 rounded-2xl bg-black/20 p-3 sm:grid-cols-[auto_1fr_1fr_auto]">
              <GripVertical className="mt-3 h-4 w-4 text-white/35" />
              <input className={input} value={item.label} onChange={(event) => updateLink(setMenuItems, item.id, "label", event.target.value)} />
              <input className={input} value={item.href} onChange={(event) => updateLink(setMenuItems, item.id, "href", event.target.value)} />
              <button onClick={() => deleteLink(setMenuItems, item.id)} className="rounded-xl p-2 text-red-200"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </section>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">SEO</h2>
        <TextField label="Meta title" name="seoDefaultTitle" value={(settings.seoDefaultTitle as string) ?? ""} onChange={setValue} />
        <TextField label="Keywords" name="seoKeywords" value={(settings.seoKeywords as string) ?? ""} onChange={setValue} />
        <label className="lg:col-span-2 block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/40">Meta description</span>
          <textarea className={input} rows={4} value={(settings.seoDefaultDescription as string) ?? ""} onChange={(event) => setValue("seoDefaultDescription", event.target.value)} />
        </label>
        <MediaUploader label="OG image" value={(settings.ogImage as string) ?? ""} onChange={(url) => setValue("ogImage", url)} />
        <TextField label="Twitter card" name="twitterCard" value={(settings.twitterCard as string) ?? "summary_large_image"} onChange={setValue} />
      </section>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">Theme and Newsletter</h2>
        <TextField label="Primary color" name="primaryColor" value={(settings.primaryColor as string) ?? "#3b82f6"} onChange={setValue} />
        <TextField label="Accent color" name="accentColor" value={(settings.accentColor as string) ?? "#22d3ee"} onChange={setValue} />
        <TextField label="Theme mode" name="themeMode" value={(settings.themeMode as string) ?? "system"} onChange={setValue} />
        <TextField label="Newsletter title" name="newsletterTitle" value={(settings.newsletterTitle as string) ?? ""} onChange={setValue} />
        <TextField label="Newsletter subtitle" name="newsletterDescription" value={(settings.newsletterDescription as string) ?? ""} onChange={setValue} />
        <TextField label="Button text" name="newsletterButtonText" value={(settings.newsletterButtonText as string) ?? "Subscribe"} onChange={setValue} />
      </section>

      <section className={`${panel} grid gap-4 lg:grid-cols-2`}>
        <h2 className="lg:col-span-2 font-semibold text-white">Contact and Footer</h2>
        <TextField label="Email" name="contactEmail" value={(settings.contactEmail as string) ?? ""} onChange={setValue} />
        <TextField label="Phone" name="contactPhone" value={(settings.contactPhone as string) ?? ""} onChange={setValue} />
        <TextField label="Address" name="contactAddress" value={(settings.contactAddress as string) ?? ""} onChange={setValue} />
        <TextField label="LinkedIn" name="socialLinkedin" value={(settings.socialLinkedin as string) ?? ""} onChange={setValue} />
        <TextField label="X/Twitter" name="socialTwitter" value={(settings.socialTwitter as string) ?? ""} onChange={setValue} />
        <TextField label="GitHub" name="socialGithub" value={(settings.socialGithub as string) ?? ""} onChange={setValue} />
        <TextField label="Copyright" name="copyright" value={(settings.copyright as string) ?? "© BigTechJournals"} onChange={setValue} />
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">Quick Links</h3>
            <button onClick={() => addLink(setFooterLinks)} className="rounded-xl bg-white/[0.06] p-2 text-white/70"><Plus className="h-4 w-4" /></button>
          </div>
          <div className="space-y-2">
            {footerLinks.map((item) => (
              <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input className={input} value={item.label} onChange={(event) => updateLink(setFooterLinks, item.id, "label", event.target.value)} />
                <input className={input} value={item.href} onChange={(event) => updateLink(setFooterLinks, item.id, "href", event.target.value)} />
                <button onClick={() => deleteLink(setFooterLinks, item.id)} className="rounded-xl p-2 text-red-200"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
