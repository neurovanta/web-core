"use client";

import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import { useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  Controller,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import AdminTabs from "@/app/components/admin/common/AdminTabs";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import { toast } from "sonner";
import { RiDeleteBin6Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaTiktok,
  FaLink,
} from "react-icons/fa6";
import {
  Briefcase,
  Factory,
  ImageIcon,
  Layers,
  Link2,
  ListOrdered,
  Mail,
  Plus,
  Share2,
} from "lucide-react";
import ReorderNavLinksDialog, {
  MenuItem,
} from "@/app/components/admin/Navigation/ReorderNavLinksDialog";
import { cn } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────────────── */
type Toggleable = { isHidden: boolean };

interface GlobalSettingsForm {
  contact: { email: string; phone: string; address: string };
  socials: { label: string; type: string; link: string; isHidden: boolean }[];
  header: {
    image: string;
    solutionsLabel: string;
    systemsLabel: string;
    industriesLabel: string;
    menuItems: MenuItem[];
    solutions: {
      solutionId: string;
      thumbnailTitle: string;
      slug: string;
      isHidden: boolean;
    }[];
    systems: { categoryId: string; title: string; isHidden: boolean }[];
    industries: {
      industryId: string;
      thumbnailTitle: string;
      slug: string;
      isHidden: boolean;
    }[];
  };
  footer: {
    image: string;
    imageAlt: string;
    solutionsLabel: string;
    systemsLabel: string;
    quickLinks: { label: string; link: string; isHidden: boolean }[];
    solutions: {
      solutionId: string;
      thumbnailTitle: string;
      slug: string;
      isHidden: boolean;
    }[];
    systems: { categoryId: string; title: string; isHidden: boolean }[];
  };
}

type Tab = "general" | "header" | "footer";

/* ─── Small UI pieces ─────────────────────────────────────────────── */
const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  x: FaXTwitter,
  twitter: FaXTwitter,
  tiktok: FaTiktok,
};

function SocialIcon({ label }: { label?: string }) {
  const Icon = SOCIAL_ICONS[(label || "").trim().toLowerCase()] ?? FaLink;
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream-bg text-secondary/70">
      <Icon className="h-4 w-4" />
    </span>
  );
}

function EyeToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      title={
        value ? "Hidden on website: click to show" : "Visible: click to hide"
      }
      aria-label={value ? "Show item" : "Hide item"}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer",
        value
          ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
          : "bg-green-50 text-green-600 hover:bg-green-100",
      )}
    >
      {value ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
    </button>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  badge,
  action,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(81,70,62,0.12)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-bg text-secondary/70">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-semibold text-secondary">
                {title}
              </h2>
              {badge}
            </div>
            {description && (
              <p className="mt-0.5 text-[12.5px] text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[12.5px] font-medium text-gray-600">
      {children}
    </span>
  );
}

function VisibleBadge({ items }: { items?: Toggleable[] }) {
  const total = items?.length ?? 0;
  const visible = (items ?? []).filter((i) => !i?.isHidden).length;
  if (!total) return null;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium",
        visible === total
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700",
      )}
    >
      {visible} of {total} visible
    </span>
  );
}

/** "Show all / Hide all" for a list of toggleable rows. */
function BulkVisibility({
  name,
  items,
  setValue,
}: {
  name: string;
  items?: Toggleable[];
  setValue: UseFormSetValue<GlobalSettingsForm>;
}) {
  if (!items?.length) return null;
  const setAll = (hidden: boolean) =>
    items.forEach((_, i) =>
      setValue(`${name}.${i}.isHidden` as Path<GlobalSettingsForm>, hidden, {
        shouldDirty: true,
      }),
    );
  const btn =
    "rounded-md px-2 py-1 text-[12px] font-medium text-gray-500 transition-colors hover:bg-cream-bg hover:text-secondary cursor-pointer";
  return (
    <div className="flex items-center gap-1">
      <button type="button" className={btn} onClick={() => setAll(false)}>
        Show all
      </button>
      <span className="h-3 w-px bg-gray-200" />
      <button type="button" className={btn} onClick={() => setAll(true)}>
        Hide all
      </button>
    </div>
  );
}

/** Read-only list of synced items (solutions/systems/industries) with a visibility toggle. */
function ToggleList({
  name,
  fields,
  emptyText,
  control,
  watchItem,
}: {
  name: string;
  fields: { id: string }[];
  emptyText: string;
  control: ReturnType<typeof useForm<GlobalSettingsForm>>["control"];
  watchItem: (index: number) => { title?: string; isHidden?: boolean };
}) {
  if (fields.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-color px-4 py-6 text-center text-sm text-gray-400">
        {emptyText}
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {fields.map((field, index) => {
        const { title, isHidden } = watchItem(index);
        return (
          <li
            key={field.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
              isHidden
                ? "border-dashed border-gray-200 bg-gray-50/60"
                : "border-black/[0.08] bg-white",
            )}
          >
            <Controller
              control={control}
              name={`${name}.${index}.isHidden` as Path<GlobalSettingsForm>}
              render={({ field: f }) => (
                <EyeToggle value={Boolean(f.value)} onChange={f.onChange} />
              )}
            />
            <span
              className={cn(
                "flex-1 truncate text-sm",
                isHidden ? "text-gray-400 line-through" : "text-secondary",
              )}
            >
              {title || "Untitled"}
            </span>
            {isHidden && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Hidden
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function GlobalSettingsPage() {
  const [reorderOpen, setReorderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    resetField,
    getValues,
  } = useForm<GlobalSettingsForm>();
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);

  const {
    fields: socials,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: "socials" });
  const {
    fields: quickLinks,
    append: appendQuickLink,
    remove: removeQuickLink,
  } = useFieldArray({ control, name: "footer.quickLinks" });
  const { fields: headerSolutions } = useFieldArray({
    control,
    name: "header.solutions",
  });
  const { fields: headerSystems } = useFieldArray({
    control,
    name: "header.systems",
  });
  const { fields: headerIndustries } = useFieldArray({
    control,
    name: "header.industries",
  });
  const { fields: footerSolutions } = useFieldArray({
    control,
    name: "footer.solutions",
  });
  const { fields: footerSystems } = useFieldArray({
    control,
    name: "footer.systems",
  });

  const values = watch();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/global-nav-items");
      if (!res.ok) {
        toast.error("Failed to fetch settings");
        return;
      }
      const { data } = await res.json();
      // markClean() below snapshots these values, so "unsaved changes" tracks edits only.
      reset({
        contact: {
          email: data.contact?.email ?? "",
          phone: data.contact?.phone ?? "",
          address: data.contact?.address ?? "",
        },
        socials: data.socials ?? [],
        header: {
          image: data.header.image ?? "",
          solutionsLabel: data.header.solutionsLabel ?? "Solutions",
          systemsLabel: data.header.systemsLabel ?? "Longevity Systems",
          industriesLabel: data.header.industriesLabel ?? "Industries We Serve",
          menuItems: data.header.menuItems ?? [],
          solutions: data.header.solutions ?? [],
          systems: data.header.systems ?? [],
          industries: data.header.industries ?? [],
        },
        footer: {
          image: data.footer.image ?? "",
          imageAlt: data.footer.imageAlt ?? "",
          solutionsLabel: data.footer.solutionsLabel ?? "Solutions",
          systemsLabel: data.footer.systemsLabel ?? "Longevity Systems",
          quickLinks: data.footer.quickLinks ?? [],
          solutions: data.footer.solutions ?? [],
          systems: data.footer.systems ?? [],
        },
      });
      markClean();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onSubmit = async (data: GlobalSettingsForm) => {
    setIsSaving(true);
    try {
      data.socials = data.socials.map((s) => ({
        ...s,
        type: s.label?.toLowerCase() || "",
      }));
      const res = await fetch("/api/admin/global-nav-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Settings saved");
        reset(data);
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsSaving(false);
  };

  // spinner until the page data has loaded
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchData().finally(() => setPageLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupLabel = (key?: MenuItem["groupKey"]) =>
    key === "solutions"
      ? values.header?.solutionsLabel || "Solutions"
      : key === "systems"
        ? values.header?.systemsLabel || "Longevity Systems"
        : values.header?.industriesLabel || "Industries We Serve";

  const headerCount =
    (values.header?.menuItems ?? []).filter((m) => !m.isHidden).length ||
    undefined;

  return (
    <AdminLoadable loading={pageLoading}>
      <div className="flex flex-col gap-5">
        <AdminTabs
          tabs={[
            { key: "general", label: "Contact & Socials" },
            { key: "header", label: "Header", count: headerCount },
            { key: "footer", label: "Footer" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* ════════════ General ════════════ */}
          <div
            className={cn(
              "flex-col gap-5",
              activeTab === "general" ? "flex" : "hidden",
            )}
          >
            <Section
              icon={Mail}
              title="Contact Details"
              description="Shown in the footer. Email and phone are also used for the header contact links."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...register("contact.email")}
                    type="email"
                    placeholder="mail@example.com"
                  />
                </label>
                <label>
                  <FieldLabel>Phone</FieldLabel>
                  <Input {...register("contact.phone")} placeholder="+971…" />
                </label>
                <label className="md:col-span-2">
                  <FieldLabel>Address (footer only)</FieldLabel>
                  <Textarea
                    {...register("contact.address")}
                    placeholder={
                      "Company name\nBuilding, street\nCity, Country"
                    }
                    rows={3}
                  />
                  <span className="mt-1 block text-[11.5px] text-gray-400">
                    Each new line is shown on its own line on the website.
                  </span>
                </label>
              </div>
            </Section>

            <Section
              icon={Share2}
              title="Social Media"
              description="The label decides the icon and brand colour (Facebook, Instagram, LinkedIn, Youtube)."
              badge={<VisibleBadge items={values.socials} />}
              action={
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendSocial({
                      label: "",
                      type: "",
                      link: "",
                      isHidden: false,
                    })
                  }
                >
                  <Plus className="h-4 w-4" /> Add Social
                </Button>
              }
            >
              {socials.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border-color px-4 py-6 text-center text-sm text-gray-400">
                  No social links yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {socials.map((field, index) => {
                    const hidden = values.socials?.[index]?.isHidden;
                    return (
                      <li
                        key={field.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-2.5",
                          hidden
                            ? "border-dashed border-gray-200 bg-gray-50/60"
                            : "border-black/[0.08]",
                        )}
                      >
                        <Controller
                          control={control}
                          name={`socials.${index}.isHidden`}
                          render={({ field: f }) => (
                            <EyeToggle value={f.value} onChange={f.onChange} />
                          )}
                        />
                        <SocialIcon label={values.socials?.[index]?.label} />
                        <Input
                          {...register(`socials.${index}.label`)}
                          placeholder="Facebook"
                          className="w-[180px] shrink-0"
                        />
                        <Input
                          {...register(`socials.${index}.link`)}
                          placeholder="https://…"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeSocial(index)}
                          aria-label="Remove social link"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        >
                          <RiDeleteBin6Line size={17} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>
          </div>

          {/* ════════════ Header ════════════ */}
          <div
            className={cn(
              "flex-col gap-5",
              activeTab === "header" ? "flex" : "hidden",
            )}
          >
            <Section
              icon={ListOrdered}
              title="Header Menu"
              description="Order and visibility of the main menu. Changes in the reorder dialog are saved immediately."
              action={
                <Button type="button" onClick={() => setReorderOpen(true)}>
                  Reorder / Edit Links
                </Button>
              }
            >
              {(values.header?.menuItems ?? []).length === 0 ? (
                <p className="text-sm text-gray-400">No menu items.</p>
              ) : (
                <ol className="flex flex-wrap gap-2">
                  {(values.header?.menuItems ?? []).map((item, i) => (
                    <li
                      key={item._id ?? i}
                      className={cn(
                        "flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-[13px]",
                        item.isHidden
                          ? "border-dashed border-gray-200 text-gray-400"
                          : "border-black/[0.08] bg-white text-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                          item.isHidden
                            ? "bg-gray-100 text-gray-400"
                            : "bg-secondary text-[#E2D3C3]",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className={item.isHidden ? "line-through" : ""}>
                        {item.kind === "link"
                          ? item.label || "Untitled Link"
                          : groupLabel(item.groupKey)}
                      </span>
                      {item.kind === "group" && (
                        <span className="rounded-full bg-cream-bg px-1.5 text-[10px] font-medium uppercase tracking-wide text-secondary/60">
                          Dropdown
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </Section>

            <Section
              icon={ImageIcon}
              title="Menu Background Image"
              description="Shown behind the full-screen menu with a dark overlay. Leave empty to use the footer image."
            >
              <div className="max-w-xl">
                <FieldLabel>Image</FieldLabel>
                <Controller
                  name="header.image"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      recommendedDimension="2880 x 1620"
                    />
                  )}
                />
              </div>
            </Section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
              <Section
                icon={Briefcase}
                title="Solutions Dropdown"
                badge={<VisibleBadge items={values.header?.solutions} />}
                action={
                  <BulkVisibility
                    name="header.solutions"
                    items={values.header?.solutions}
                    setValue={setValue}
                  />
                }
              >
                <label className="mb-4 block">
                  <FieldLabel>Menu label</FieldLabel>
                  <Input
                    {...register("header.solutionsLabel")}
                    placeholder="Solutions"
                  />
                </label>
                <ToggleList
                  name="header.solutions"
                  fields={headerSolutions}
                  emptyText="No solutions found."
                  control={control}
                  watchItem={(i) => ({
                    title: values.header?.solutions?.[i]?.thumbnailTitle,
                    isHidden: values.header?.solutions?.[i]?.isHidden,
                  })}
                />
              </Section>

              <Section
                icon={Layers}
                title="Longevity Systems Dropdown"
                badge={<VisibleBadge items={values.header?.systems} />}
                action={
                  <BulkVisibility
                    name="header.systems"
                    items={values.header?.systems}
                    setValue={setValue}
                  />
                }
              >
                <label className="mb-4 block">
                  <FieldLabel>Menu label</FieldLabel>
                  <Input
                    {...register("header.systemsLabel")}
                    placeholder="Longevity Systems"
                  />
                </label>
                <ToggleList
                  name="header.systems"
                  fields={headerSystems}
                  emptyText="No system categories found."
                  control={control}
                  watchItem={(i) => ({
                    title: values.header?.systems?.[i]?.title,
                    isHidden: values.header?.systems?.[i]?.isHidden,
                  })}
                />
              </Section>

              <Section
                icon={Factory}
                title="Industries Dropdown"
                badge={<VisibleBadge items={values.header?.industries} />}
                action={
                  <BulkVisibility
                    name="header.industries"
                    items={values.header?.industries}
                    setValue={setValue}
                  />
                }
              >
                <label className="mb-4 block">
                  <FieldLabel>Menu label</FieldLabel>
                  <Input
                    {...register("header.industriesLabel")}
                    placeholder="Industries We Serve"
                  />
                </label>
                <ToggleList
                  name="header.industries"
                  fields={headerIndustries}
                  emptyText="No industries found."
                  control={control}
                  watchItem={(i) => ({
                    title: values.header?.industries?.[i]?.thumbnailTitle,
                    isHidden: values.header?.industries?.[i]?.isHidden,
                  })}
                />
              </Section>
            </div>
          </div>

          {/* ════════════ Footer ════════════ */}
          <div
            className={cn(
              "flex-col gap-5",
              activeTab === "footer" ? "flex" : "hidden",
            )}
          >
            <Section
              icon={ImageIcon}
              title="Background Image"
              description="Shown behind the footer with a dark overlay. Leave empty to use the default image."
            >
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5">
                <div>
                  <FieldLabel>Image</FieldLabel>
                  <Controller
                    name="footer.image"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        recommendedDimension="2880 x 1155"
                      />
                    )}
                  />
                </div>
                <label>
                  <FieldLabel>Alt text</FieldLabel>
                  <Input
                    {...register("footer.imageAlt")}
                    placeholder="Describe the image"
                  />
                </label>
              </div>
            </Section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
              <Section
                icon={Briefcase}
                title="Solutions Column"
                badge={<VisibleBadge items={values.footer?.solutions} />}
                action={
                  <BulkVisibility
                    name="footer.solutions"
                    items={values.footer?.solutions}
                    setValue={setValue}
                  />
                }
              >
                <label className="mb-4 block">
                  <FieldLabel>Column heading</FieldLabel>
                  <Input
                    {...register("footer.solutionsLabel")}
                    placeholder="Solutions"
                  />
                </label>
                <ToggleList
                  name="footer.solutions"
                  fields={footerSolutions}
                  emptyText="No solutions found."
                  control={control}
                  watchItem={(i) => ({
                    title: values.footer?.solutions?.[i]?.thumbnailTitle,
                    isHidden: values.footer?.solutions?.[i]?.isHidden,
                  })}
                />
              </Section>

              <Section
                icon={Layers}
                title="Longevity Systems Column"
                badge={<VisibleBadge items={values.footer?.systems} />}
                action={
                  <BulkVisibility
                    name="footer.systems"
                    items={values.footer?.systems}
                    setValue={setValue}
                  />
                }
              >
                <label className="mb-4 block">
                  <FieldLabel>Column heading</FieldLabel>
                  <Input
                    {...register("footer.systemsLabel")}
                    placeholder="Longevity Systems"
                  />
                </label>
                <ToggleList
                  name="footer.systems"
                  fields={footerSystems}
                  emptyText="No system categories found."
                  control={control}
                  watchItem={(i) => ({
                    title: values.footer?.systems?.[i]?.title,
                    isHidden: values.footer?.systems?.[i]?.isHidden,
                  })}
                />
              </Section>
            </div>

            <Section
              icon={Link2}
              title="Quick Links Column"
              description="Use a path like /about-us for site pages, or a full URL for external links."
              badge={<VisibleBadge items={values.footer?.quickLinks} />}
              action={
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendQuickLink({ label: "", link: "", isHidden: false })
                  }
                >
                  <Plus className="h-4 w-4" /> Add Quick Link
                </Button>
              }
            >
              {quickLinks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border-color px-4 py-6 text-center text-sm text-gray-400">
                  No quick links yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {quickLinks.map((field, index) => {
                    const hidden = values.footer?.quickLinks?.[index]?.isHidden;
                    return (
                      <li
                        key={field.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-2.5",
                          hidden
                            ? "border-dashed border-gray-200 bg-gray-50/60"
                            : "border-black/[0.08]",
                        )}
                      >
                        <Controller
                          control={control}
                          name={`footer.quickLinks.${index}.isHidden`}
                          render={({ field: f }) => (
                            <EyeToggle value={f.value} onChange={f.onChange} />
                          )}
                        />
                        <Input
                          {...register(`footer.quickLinks.${index}.label`)}
                          placeholder="About Neuro Vanta"
                          className="flex-1"
                        />
                        <Input
                          {...register(`footer.quickLinks.${index}.link`)}
                          placeholder="/about-us"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeQuickLink(index)}
                          aria-label="Remove quick link"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        >
                          <RiDeleteBin6Line size={17} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>
          </div>

          {/* Save */}
          <AdminPageActions isDirty={isDirty} changes={changes}>
            <AdminSubmitButton saving={isSaving} label="Save Settings" />
          </AdminPageActions>
        </form>

        <ReorderNavLinksDialog
          open={reorderOpen}
          onClose={() => setReorderOpen(false)}
          menuItems={values.header?.menuItems ?? []}
          labels={{
            solutions: values.header?.solutionsLabel || "Solutions",
            systems: values.header?.systemsLabel || "Longevity Systems",
            industries: values.header?.industriesLabel || "Industries We Serve",
          }}
          // The dialog saves on its own, so make the result the new baseline
          // (keeps it out of "unsaved changes").
          onSaved={(items) =>
            resetField("header.menuItems", { defaultValue: items })
          }
        />
      </div>
    </AdminLoadable>
  );
}
