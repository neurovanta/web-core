"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type UseFormGetValues,
} from "react-hook-form";

// Empty strings, null and undefined all count as "no value", so a field that is
// merely registered (undefined -> "") does not read as an edit.
const serialize = (values: unknown, ignore: string[] = []) =>
  JSON.stringify(values, function (key, value) {
    // top-level keys only: `this` is the root object for those
    if (ignore.length && this === values && ignore.includes(key)) return undefined;
    return value === "" || value === null || value === undefined ? undefined : value;
  });

const LABELS: Record<string, string> = { seo: "SEO" };

const sectionLabel = (key: string) =>
  LABELS[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

export type UnsavedChange = { section: string; fields: string[] };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const unionKeys = (a: object, b: object) => [
  ...new Set([...Object.keys(a), ...Object.keys(b)]),
];

const FIELD_LABELS: Record<string, string> = {
  isHidden: "Visibility",
  seo: "SEO",
};

const fieldLabel = (key: string) =>
  FIELD_LABELS[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

function diffFields(before: unknown, after: unknown, prefix = ""): string[] {
  if (serialize(before) === serialize(after)) return [];

  if (Array.isArray(before) || Array.isArray(after)) {
    const a = Array.isArray(before) ? before : [];
    const b = Array.isArray(after) ? after : [];
    const out: string[] = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const item = `${prefix}Item ${i + 1}`;
      if (i >= a.length) out.push(`${item} (added)`);
      else if (i >= b.length) out.push(`${item} (removed)`);
      else
        out.push(
          ...diffFields(a[i], b[i], `${item} › `).map((f) => f || item),
        );
    }
    return out;
  }

  if (isObject(before) || isObject(after)) {
    const a = isObject(before) ? before : {};
    const b = isObject(after) ? after : {};
    return unionKeys(a, b).flatMap((key) =>
      diffFields(a[key], b[key], `${prefix}${fieldLabel(key)} › `),
    );
  }

  return [prefix.replace(/ › $/, "")];
}

/**
 * Tracks unsaved edits on a CMS form (ported from Brighton).
 * Call `markClean()` after the data loads and after a successful save; the form is
 * dirty when its values differ from that snapshot. Warns on reload / tab close.
 * `ignore`: top-level keys saved through their own requests (e.g. a list whose
 * show/hide and delete save straight away), so they never count as unsaved.
 */
export function useUnsavedChanges<T extends FieldValues>(
  control: Control<T>,
  getValues: UseFormGetValues<T>,
  { ignore = [] }: { ignore?: string[] } = {},
) {
  const values = useWatch({ control });
  const [baseline, setBaseline] = useState<string | null>(null);
  const ignoreKey = ignore.join("|");

  // Two frames: lets field arrays / registered inputs settle before snapshotting.
  const markClean = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setBaseline(serialize(getValues(), ignoreKey ? ignoreKey.split("|") : [])),
      ),
    );
  }, [getValues, ignoreKey]);

  const current = serialize(values, ignore);
  const isDirty = baseline !== null && current !== baseline;

  const changes = useMemo<UnsavedChange[]>(() => {
    if (!isDirty || baseline === null) return [];
    const before = (JSON.parse(baseline) ?? {}) as Record<string, unknown>;
    const after = (JSON.parse(current) ?? {}) as Record<string, unknown>;
    return unionKeys(before, after)
      .filter((key) => serialize(before[key]) !== serialize(after[key]))
      .map((key) => ({
        section: sectionLabel(key),
        fields: diffFields(before[key], after[key]),
      }));
  }, [isDirty, baseline, current]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  return { isDirty, markClean, changes };
}
