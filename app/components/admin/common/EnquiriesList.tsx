"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, FileText, Inbox, Loader2, Mail, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Enquiry = Record<string, string> & { _id: string; createdAt: string };

export interface EnquiriesConfig {
  // API segment: /api/admin/enquiries/<kind>
  title: string;
  kind: "home" | "contact" | "career";
  // field names in the enquiry documents (several name fields are joined, e.g. first + last name)
  nameKey: string | string[];
  emailKey: string;
  phoneKey: string;
  messageKey: string;
  messageLabel?: string;
  // extra columns (e.g. company, service, position); `filter` adds a dropdown filter for it (first one only)
  extras?: { key: string; label: string; filter?: boolean }[];
  // uploaded file link (e.g. CV)
  attachmentKey?: string;
  attachmentLabel?: string;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const iconBtn =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-secondary/60 transition-colors";

export default function EnquiriesList({ config }: { config: EnquiriesConfig }) {
  const {
    kind,
    title,
    nameKey,
    emailKey,
    phoneKey,
    messageKey,
    messageLabel = "Message",
    extras = [],
    attachmentKey,
    attachmentLabel = "Attachment",
  } = config;
  const filterField = extras.find((x) => x.filter);
  const nameOf = useCallback(
    (e: Enquiry) =>
      (Array.isArray(nameKey) ? nameKey.map((k) => e[k]).filter(Boolean).join(" ") : e[nameKey]) || "",
    [nameKey],
  );
  const [list, setList] = useState<Enquiry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/enquiries/${kind}`);
      const data = await res.json();
      if (res.ok) setList(data.data ?? []);
      else toast.error(data.message || "Failed to load enquiries");
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setLoaded(true);
    }
  }, [kind]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${kind}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) return void toast.error(data.message || "Failed to delete enquiry");
      toast.success(data.message || "Enquiry deleted");
      setList((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error("Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  const filterOptions = useMemo(
    () => (filterField ? Array.from(new Set(list.map((e) => e[filterField.key]).filter(Boolean))).sort() : []),
    [list, filterField],
  );

  // newest first (API order), then filter and search
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list
      .filter((e) => filter === "all" || (filterField && e[filterField.key] === filter))
      .filter(
        (e) =>
          !q ||
          [nameOf(e), e[emailKey], e[phoneKey], e[messageKey], ...extras.map((x) => e[x.key])].some((v) =>
            v?.toLowerCase().includes(q),
          ),
      );
  }, [list, search, filter, filterField, extras, nameOf, emailKey, phoneKey, messageKey]);

  const exportCsv = () => {
    const head = [
      "Received",
      "Name",
      "Email",
      "Phone",
      ...extras.map((x) => x.label),
      messageLabel,
      ...(attachmentKey ? [attachmentLabel] : []),
    ];
    const quote = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const rows = visible.map((e) =>
      [
        formatDate(e.createdAt),
        nameOf(e),
        e[emailKey],
        e[phoneKey],
        ...extras.map((x) => e[x.key]),
        e[messageKey],
        ...(attachmentKey ? [e[attachmentKey]] : []),
      ]
        .map(quote)
        .join(","),
    );
    const csv = [head.map(quote).join(","), ...rows].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${kind}-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-[14px] text-secondary/70">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading enquiries
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* toolbar: count, search, filter, export */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-color/50 bg-white p-4 shadow-[0_1px_2px_rgba(81,70,62,0.05)]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-secondary">{title}</h2>
          <span className="rounded-full bg-primary/50 px-2.5 py-0.5 text-xs font-medium text-secondary">
            {visible.length === list.length ? list.length : `${visible.length} of ${list.length}`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
            <input
              type="search"
              placeholder="Search name, email, phone, message"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-72 rounded-lg border border-border-color/70 bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-secondary/50"
            />
          </div>
          {filterField && filterOptions.length > 0 && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label={`Filter by ${filterField.label}`}
              className="h-9 cursor-pointer rounded-lg border border-border-color/70 bg-white px-3 text-sm text-secondary outline-none focus:border-secondary/50"
            >
              <option value="all">All {filterField.label.toLowerCase()}s</option>
              {filterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={exportCsv}
            disabled={visible.length === 0}
            title="Download the enquiries shown as a CSV file"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-color/70 bg-white px-3 text-sm text-secondary transition-colors hover:border-secondary/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* list */}
      <div className="overflow-hidden rounded-2xl border border-border-color/50 bg-white shadow-[0_1px_2px_rgba(81,70,62,0.05)]">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center text-sm text-secondary/60">
            <Inbox className="h-8 w-8 text-secondary/30" />
            {list.length === 0 ? "No enquiries yet." : "No enquiries match the search or filter."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-color/50 bg-cream-bg text-xs uppercase tracking-wide text-secondary/60">
                <tr>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  {extras.map((x) => (
                    <th key={x.key} className="px-4 py-3 font-medium">
                      {x.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">{messageLabel}</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/30">
                {visible.map((e) => (
                  <tr key={e._id} className="align-top transition-colors hover:bg-cream-bg/60">
                    <td className="whitespace-nowrap px-4 py-3 text-secondary/60">{formatDate(e.createdAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-secondary">{nameOf(e) || "-"}</p>
                      <a href={`mailto:${e[emailKey]}`} className="text-xs text-secondary/70 underline-offset-2 hover:underline">
                        {e[emailKey]}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {e[phoneKey] ? (
                        <a href={`tel:${e[phoneKey]}`} className="text-secondary/80 hover:underline">
                          {e[phoneKey]}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    {extras.map((x) => (
                      <td key={x.key} className="px-4 py-3">
                        {e[x.key] ? (
                          <span className="inline-block rounded-full bg-primary/40 px-2.5 py-0.5 text-xs text-secondary">
                            {e[x.key]}
                          </span>
                        ) : (
                          <span className="text-secondary/40">-</span>
                        )}
                      </td>
                    ))}
                    <td className="max-w-[340px] px-4 py-3 text-secondary/70">
                      <p className="line-clamp-2">{e[messageKey] || "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {attachmentKey &&
                          (e[attachmentKey] ? (
                            <a
                              href={e[attachmentKey]}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open ${attachmentLabel}`}
                              className={cn(iconBtn, "hover:bg-primary/40 hover:text-secondary")}
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          ) : (
                            <span
                              title={`No ${attachmentLabel} saved (it was sent with the notification email)`}
                              className={cn(iconBtn, "cursor-not-allowed text-secondary/20")}
                            >
                              <FileText className="h-4 w-4" />
                            </span>
                          ))}
                        {/* full enquiry */}
                        <Dialog>
                          <DialogTrigger title="View enquiry" className={cn(iconBtn, "hover:bg-primary/40 hover:text-secondary")}>
                            <Eye className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="bg-white sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-secondary">
                                {kind === "career" ? "Application" : "Enquiry"} from {nameOf(e)}
                              </DialogTitle>
                              <DialogDescription>Received {formatDate(e.createdAt)}</DialogDescription>
                            </DialogHeader>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                              {[
                                ["Name", nameOf(e)],
                                ["Email", e[emailKey]],
                                ["Phone", e[phoneKey]],
                                ...extras.map((x) => [x.label, e[x.key]]),
                              ].map(([label, value]) => (
                                <div key={label}>
                                  <dt className="text-xs uppercase tracking-wide text-secondary/50">{label}</dt>
                                  <dd className="break-words text-secondary">{value || "-"}</dd>
                                </div>
                              ))}
                            </dl>
                            <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-border-color/50 bg-cream-bg p-4 text-sm leading-relaxed text-secondary">
                              {e[messageKey] || `No ${messageLabel.toLowerCase()}.`}
                            </div>
                            {attachmentKey && e[attachmentKey] && (
                              <a
                                href={e[attachmentKey]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-fit items-center gap-2 rounded-lg border border-border-color/60 bg-white px-3 py-2 text-sm text-secondary hover:bg-cream-bg"
                              >
                                <FileText className="h-4 w-4" />
                                Open {attachmentLabel}
                              </a>
                            )}
                            <div className="flex flex-wrap justify-end gap-2">
                              <DialogClose className="cursor-pointer rounded-full border border-border-color/70 px-4 py-2 text-sm text-secondary hover:bg-cream-bg">
                                Close
                              </DialogClose>
                              {e[phoneKey] && (
                                <a
                                  href={`tel:${e[phoneKey]}`}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border-color/70 px-4 py-2 text-sm text-secondary hover:bg-cream-bg"
                                >
                                  <Phone className="h-4 w-4" />
                                  Call
                                </a>
                              )}
                              <a
                                href={`mailto:${e[emailKey]}?subject=${encodeURIComponent(kind === "career" ? "Re: your application to Neuro Vanta" : "Re: your enquiry to Neuro Vanta")}`}
                                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm text-white hover:bg-[#3f3630]"
                              >
                                <Mail className="h-4 w-4" />
                                Reply by email
                              </a>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* delete, after confirming */}
                        <Dialog>
                          <DialogTrigger
                            title="Delete enquiry"
                            disabled={deletingId === e._id}
                            className={cn(iconBtn, "hover:bg-red-50 hover:text-red-600 disabled:opacity-50")}
                          >
                            {deletingId === e._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-secondary">
                                Delete the {kind === "career" ? "application" : "enquiry"} from {nameOf(e)}?
                              </DialogTitle>
                              <DialogDescription>This cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <DialogClose className="cursor-pointer rounded-full border border-border-color/70 px-4 py-2 text-sm text-secondary hover:bg-cream-bg">
                                Cancel
                              </DialogClose>
                              <DialogClose
                                className="cursor-pointer rounded-full bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                                onClick={() => remove(e._id)}
                              >
                                Delete
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
