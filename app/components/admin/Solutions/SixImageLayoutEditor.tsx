"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import {
  AlertTriangle,
  Check,
  Monitor,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SLOTS = 6;

// Mirrors the website section (solutions/sections/SolutionsAnimated.tsx): image i flies to slot i.
// Positions are the slot centres in % of the preview board.
const LAYOUT = {
  desktop: {
    names: [
      "Top left",
      "Top right",
      "Middle left (outer edge)",
      "Middle right (outer edge)",
      "Bottom, left of centre",
      "Bottom, right of centre",
    ],
    pos: [
      { x: 25, y: 19 },
      { x: 75, y: 19 },
      { x: 7, y: 50 },
      { x: 93, y: 50 },
      { x: 39, y: 81 },
      { x: 61, y: 81 },
    ],
  },
  mobile: {
    names: [
      "Top centre",
      "Upper row, left",
      "Upper row, right",
      "Lower row, left",
      "Lower row, right",
      "Bottom centre",
    ],
    pos: [
      { x: 50, y: 10 },
      { x: 16, y: 26 },
      { x: 84, y: 26 },
      { x: 16, y: 74 },
      { x: 84, y: 74 },
      { x: 50, y: 90 },
    ],
  },
} as const;

type Item = { image?: string; imageAlt?: string };
type View = keyof typeof LAYOUT;

// Visual editor for a section that places exactly six images around a centred title:
// pick a position on the map, then upload / edit that image on the right.
export default function SixImageLayoutEditor<T extends FieldValues>({
  name,
  fields,
  items,
  title,
  description,
  control,
  register,
  onAdd,
  onRemove,
}: {
  name: string; // e.g. "fourthSection.items"
  fields: { id: string }[];
  items: Item[];
  title?: string;
  description?: string;
  control: Control<T>;
  register: UseFormRegister<T>;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const [view, setView] = useState<View>("desktop");
  const [selected, setSelected] = useState(0);

  const withImage = items.slice(0, SLOTS).filter((i) => i?.image).length;
  const complete = fields.length === SLOTS && withImage === SLOTS;
  const sel = Math.min(selected, Math.max(fields.length - 1, 0));
  const layout = LAYOUT[view];

  const addAndSelect = () => {
    onAdd();
    setSelected(fields.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* status + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label className="font-bold">Images</Label>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
              complete
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
            )}
          >
            {complete ? (
              <Check className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            {withImage} / {SLOTS} images
          </span>
        </div>
        <div
          role="tablist"
          aria-label="Preview layout"
          className="inline-flex items-center gap-1 rounded-full border border-border-color/60 bg-white p-1"
        >
          {(["desktop", "mobile"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                view === v
                  ? "bg-secondary text-white"
                  : "text-secondary/60 hover:text-secondary",
              )}
            >
              {v === "desktop" ? (
                <Monitor className="h-3.5 w-3.5" />
              ) : (
                <Smartphone className="h-3.5 w-3.5" />
              )}
              {v === "desktop" ? "Desktop" : "Mobile"}
            </button>
          ))}
        </div>
      </div>

      {!complete && (
        <p className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-[12.5px] text-amber-800">
          This section is designed for exactly 6 images; its scroll animation
          only runs when all 6 positions have an image.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        {/* ── position map ── */}
        <div
          className={cn(
            "relative mx-auto w-full overflow-hidden rounded-2xl border border-border-color/60 bg-white",
            view === "desktop"
              ? "aspect-[16/9]"
              : "aspect-[9/16] max-w-[300px]",
          )}
        >
          {/* decorative rings, like the site */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {[85, 62, 40].map((s) => (
              <span
                key={s}
                className="absolute rounded-full border border-secondary/10"
                style={{ width: `${s}%`, aspectRatio: "1" }}
              />
            ))}
          </div>

          {/* live title + description */}
          <div className="pointer-events-none absolute inset-x-[22%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 text-center">
            <p className="line-clamp-2 text-[11px] font-medium uppercase leading-tight tracking-wide text-secondary sm:text-[13px]">
              {title || "Section title"}
            </p>
            {view === "desktop" && (
              <p className="line-clamp-2 text-[9.5px] leading-snug text-secondary/50 sm:text-[10.5px]">
                {description || "Description"}
              </p>
            )}
          </div>

          {/* six slots */}
          {layout.pos.map((p, i) => {
            const exists = i < fields.length;
            const isNext = i === fields.length;
            const img = items[i]?.image;
            const active = exists && i === sel;
            return (
              <button
                key={i}
                type="button"
                disabled={!exists && !isNext}
                onClick={() => (exists ? setSelected(i) : addAndSelect())}
                title={`${i + 1}. ${layout.names[i]}`}
                aria-label={`Image ${i + 1}: ${layout.names[i]}${exists ? "" : " (empty)"}`}
                aria-pressed={active}
                className={cn(
                  "group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-md transition-all",
                  view === "desktop" ? "w-[11%]" : "w-[24%]",
                  "aspect-[4/5]",
                  img
                    ? "shadow-[0_6px_16px_-8px_rgba(81,70,62,0.7)]"
                    : "border-2 border-dashed border-border-color bg-cream-bg",
                  active &&
                    "z-10 scale-110 ring-[3px] ring-secondary ring-offset-2",
                  exists || isNext
                    ? "cursor-pointer hover:scale-105"
                    : "cursor-not-allowed opacity-40",
                )}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                {img ? (
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : isNext ? (
                  <Plus className="h-4 w-4 text-secondary/60" />
                ) : null}
                <span
                  className={cn(
                    "absolute left-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10.5px] font-semibold leading-none",
                    active
                      ? "bg-secondary text-white"
                      : "bg-white/90 text-secondary shadow-sm",
                  )}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── selected image editor ── */}
        <div className="flex flex-col gap-4 rounded-xl border border-border-color/60 bg-cream-bg/50 p-4">
          {fields.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center text-[13px] text-secondary/60">
              No images yet. Start with position 1 (
              {LAYOUT.desktop.names[0].toLowerCase()}).
              <button
                type="button"
                onClick={addAndSelect}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-[13px] font-medium text-white hover:bg-[#3f3630]"
              >
                <Plus className="h-4 w-4" /> Add image 1
              </button>
            </div>
          ) : (
            fields.map((field, i) =>
              i !== sel ? null : (
                <div key={field.id} className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold text-secondary">
                        Image {i + 1}
                        {i >= SLOTS && " (not shown)"}
                      </span>
                      <span className="text-[12.5px] text-secondary/60">
                        Desktop: {LAYOUT.desktop.names[i] ?? "—"} · Mobile:{" "}
                        {LAYOUT.mobile.names[i] ?? "—"}
                      </span>
                    </div>
                    {/* the six positions are fixed; only unused extras (older data) can be removed */}
                    {i >= SLOTS && i === fields.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          onRemove(i);
                          setSelected(Math.max(i - 1, 0));
                        }}
                        title="Remove this unused image"
                        className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name={`${name}.${i}.image` as Path<T>}
                      control={control}
                      render={({ field: f }) => (
                        <ImageUploader
                          value={f.value}
                          onChange={f.onChange}
                          recommendedDimension="Portrait 4:5, e.g. 800 × 1000 px"
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Alt Tag</Label>
                    <Input
                      {...register(`${name}.${i}.imageAlt` as Path<T>)}
                      placeholder="Alt Tag"
                    />
                  </div>
                  <p className="text-[12px] text-secondary/50">
                    To change this image, remove it with the × and upload a new
                    one.
                  </p>
                </div>
              ),
            )
          )}

          {fields.length > 0 && fields.length < SLOTS && (
            <button
              type="button"
              onClick={addAndSelect}
              className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 self-start rounded-full border border-border-color bg-white px-4 text-[13px] font-medium text-secondary transition-colors hover:border-secondary/40"
            >
              <Plus className="h-4 w-4" /> Add image {fields.length + 1} (
              {LAYOUT.desktop.names[fields.length].toLowerCase()})
            </button>
          )}
        </div>
      </div>

      {/* legacy data with more than six items: listed so they can be cleaned up */}
      {fields.length > SLOTS && (
        <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-[12.5px] text-amber-800">
          Only the first {SLOTS} images are used on the website. Extra:
          <div className="flex flex-wrap gap-2">
            {fields.slice(SLOTS).map((field, k) => (
              <button
                key={field.id}
                type="button"
                onClick={() => setSelected(SLOTS + k)}
                className="cursor-pointer rounded-full bg-white px-3 py-1 text-secondary ring-1 ring-amber-200 hover:ring-amber-300"
              >
                Image {SLOTS + k + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
