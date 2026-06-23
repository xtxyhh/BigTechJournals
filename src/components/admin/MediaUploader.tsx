"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, ImagePlus, Loader2, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StorageBucket } from "@/lib/storage";

type MediaUploaderProps = {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  bucket?: StorageBucket;
};

type PreviewFile = {
  name: string;
  size: number;
  url: string;
};

type UploadResponse = { url?: string; path?: string; bucket?: StorageBucket; error?: string };

export default function MediaUploader({ value = "", onChange, label = "Media", bucket = "covers" }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PreviewFile | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [manualUrl, setManualUrl] = useState(value);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const activeUrl = preview?.url ?? manualUrl;
  const sizeLabel = useMemo(() => {
    if (uploading) return `${progress}%`;
    return preview ? `${Math.max(preview.size / 1024, 1).toFixed(0)} KB` : "Public URL";
  }, [preview, progress, uploading]);

  useEffect(() => {
    setManualUrl(value);
  }, [value]);

  const compressImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") || typeof createImageBitmap === "undefined") return file;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
  }, []);

  const uploadSelectedFile = useCallback((file: File) => {
    if (!file) return;
    const next = { name: file.name, size: file.size, url: URL.createObjectURL(file) };
    setPreview(next);
    setLastFile(file);
    setError("");
    setSuccess(false);
    setUploading(true);
    setProgress(0);

    void (async () => {
      try {
        const uploadFile = await compressImage(file);
        const formData = new FormData();
        formData.set("file", uploadFile);
        formData.set("bucket", bucket);
        formData.set("folder", label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "uploads");

        const result = await new Promise<UploadResponse>((resolve, reject) => {
          const request = new XMLHttpRequest();
          request.open("POST", "/api/admin/upload");
          request.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded / event.total) * 100));
            }
          };
          request.onload = () => {
            const json = JSON.parse(request.responseText || "{}") as UploadResponse;
            if (request.status < 200 || request.status >= 300 || !json.url) {
              reject(new Error(json.error ?? "Upload failed"));
              return;
            }
            resolve(json);
          };
          request.onerror = () => reject(new Error("Upload failed"));
          request.send(formData);
        });

        setPreview(null);
        setManualUrl(result.url ?? "");
        setProgress(100);
        setSuccess(true);
        onChange?.(result.url ?? "");
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    })();
  }, [bucket, compressImage, label, onChange]);

  const setFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    uploadSelectedFile(file);
  }, [uploadSelectedFile]);

  const copyUrl = async () => {
    if (!activeUrl) return;
    await navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const clear = () => {
    setPreview(null);
    setLastFile(null);
    setManualUrl("");
    setSuccess(false);
    setError("");
    setProgress(0);
    onChange?.("");
  };

  return (
    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          {success && <p className="mt-1 text-xs text-emerald-300">Upload complete</p>}
        </div>
        <div className="flex gap-2">
          {error && lastFile && (
            <button type="button" onClick={() => uploadSelectedFile(lastFile)} disabled={uploading} aria-label="Retry upload" className="rounded-xl border border-white/[0.08] p-2 text-white/60 hover:text-white disabled:opacity-30">
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
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
        disabled={uploading}
        className={cn("relative grid min-h-44 w-full place-items-center overflow-hidden rounded-[20px] border border-dashed border-white/[0.14] bg-black/20 text-center transition hover:border-blue-400/50 disabled:cursor-wait disabled:opacity-75", activeUrl && "border-solid")}
      >
        {activeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeUrl} alt="Uploaded media preview" className="h-full max-h-72 w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-3 p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/20 text-blue-200">
              <UploadCloud className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-white">Drop an image or browse</span>
            <span className="text-xs text-white/45">Images are compressed and uploaded to Supabase Storage</span>
          </span>
        )}
        {uploading && (
          <span className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
            <span className="flex flex-col items-center gap-3 text-sm font-medium text-white">
              <Loader2 className="h-6 w-6 animate-spin text-blue-200" />
              Uploading {progress}%
            </span>
          </span>
        )}
      </button>
      {uploading && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-blue-400 transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
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
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
