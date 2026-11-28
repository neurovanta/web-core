"use client";

import {
  useFieldArray,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const iconBtn =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-secondary/60 transition-colors hover:bg-primary/40 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

// Editable list of dropdown options ({ label }) for a website form.
export default function OptionListEditor<T extends FieldValues>({
  name,
  label,
  hint,
  control,
  register,
}: {
  name: ArrayPath<T>; // e.g. "formSection.serviceOptions"
  label: string;
  hint?: string;
  control: Control<T>;
  register: UseFormRegister<T>;
}) {
  const { fields, append, remove, move } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold">{label}</Label>
      {hint && <p className="text-[12.5px] text-secondary/60">{hint}</p>}
      <div className="flex flex-col gap-2 rounded-xl border border-border-color/60 bg-cream-bg/50 p-3">
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right text-[12px] tabular-nums text-secondary/40">
              {i + 1}
            </span>
            <Input
              {...register(`${name}.${i}.label` as Path<T>)}
              placeholder="Option"
              className="bg-white"
            />
            <button
              type="button"
              title="Move up"
              aria-label="Move up"
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
              className={iconBtn}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Move down"
              aria-label="Move down"
              disabled={i === fields.length - 1}
              onClick={() => move(i, i + 1)}
              className={iconBtn}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Remove option"
              aria-label="Remove option"
              disabled={fields.length <= 1}
              onClick={() => remove(i)}
              className={cn(
                iconBtn,
                "text-red-400 hover:bg-red-50 hover:text-red-600",
              )}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ label: "" } as FieldArray<T, ArrayPath<T>>)}
          className="ml-7 inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-border-color bg-white px-4 text-[13px] font-medium text-secondary transition-colors hover:border-secondary/40"
        >
          <Plus className="h-4 w-4" /> Add option
        </button>
      </div>
    </div>
  );
}
