"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Check, Copy, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaUploaderProps = {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
};

type PreviewFile = {
  name: string;
  size: number;
  url: string;
};

export default function MediaUploader({ value = "", onChange, label = "Media" }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PreviewFile | null>(null);
  const [manualUrl, setManualUrl] = useState(value);
  const [copied, setCopied] = useState(false);

  const activeUrl = preview?.url ?? manualUrl;
  const sizeLabel = useMemo(() => (preview ? `${Math.max(preview.size / 1024, 1).toFixed(0)} KB` : "Remote URL"), [preview]);

  const setFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const next = { name: file.name, size: file.size, url: URL.createObjectURL(file) };
    setPreview(next);
    setManualUrl(next.url);
    onChange?.(next.url);
  }, [onChange]);

  const copyUrl = async () => {
    if (!activeUrl) return;
    await navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const clear = () => {
    setPreview(null);
    setManualUrl("");
    onChange?.("");
  };

  return (
    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
        <div className="flex gap-2">
          <button type="button" onClick={copyUrl} disabled={!activeUrl} aria-label="Copy media URL" className="rounded-xl border border-white/[0.08] p-2 text-white/60 hover:text-white disabled:opacity-30">
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
          </button>
          <button type="button" onClick={clear} aria-label="Delete media" className="rounded-xl border border-white/[0.08] p-2 text-white/60 hover:bg-red-500/10 hover:text-red-300">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault();
          setFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => event.preventDefault()}
        className={cn("grid min-h-44 w-full place-items-center overflow-hidden rounded-[20px] border border-dashed border-white/[0.14] bg-black/20 text-center transition hover:border-blue-400/50", activeUrl && "border-solid")}
      >
        {activeUrl ? (
          <img src={activeUrl} alt="Uploaded media preview" className="h-full max-h-72 w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-3 p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/20 text-blue-200">
              <UploadCloud className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-white">Drop an image or browse</span>
            <span className="text-xs text-white/45">Preview, copy URL, compress-ready workflow</span>
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => setFiles(event.target.files)} />

      <div className="mt-3 flex items-center gap-2">
        <ImagePlus className="h-4 w-4 text-white/35" />
        <input
          value={manualUrl}
          onChange={(event) => {
            setPreview(null);
            setManualUrl(event.target.value);
            onChange?.(event.target.value);
          }}
          placeholder="https://image-url"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
        <span className="text-xs text-white/35">{sizeLabel}</span>
      </div>
    </div>
  );
}
