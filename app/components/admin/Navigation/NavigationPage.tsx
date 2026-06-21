"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { RiDeleteBin6Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import ReorderNavLinksDialog, {
  MenuItem,
} from "@/app/components/admin/Navigation/ReorderNavLinksDialog";

interface GlobalSettingsForm {
  contact: { email: string; phone: string; address: string };
  socials: { label: string; type: string; link: string; isHidden: boolean }[];
  header: {
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
    systems: {
      categoryId: string;
      title: string;
      isHidden: boolean;
    }[];
    industries: {
      industryId: string;
      thumbnailTitle: string;
      slug: string;
      isHidden: boolean;
    }[];
  };
  footer: {
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

function EyeToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div onClick={() => onChange(!value)} className="cursor-pointer shrink-0">
      {value ? (
        <RiEyeOffLine
          className="text-gray-400 hover:scale-110 transition-all"
          size={20}
        />
      ) : (
        <RiEyeLine
          className="text-green-600 hover:scale-110 transition-all"
          size={20}
        />
      )}
    </div>
  );
}

export default function GlobalSettingsPage() {
  const [reorderOpen, setReorderOpen] = useState(false);

  const { register, handleSubmit, setValue, control, watch } =
    useForm<GlobalSettingsForm>();

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

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/global-nav-items");
      if (res.ok) {
        const { data } = await res.json();
        setValue("contact", data.contact);
        setValue("socials", data.socials ?? []);
        setValue("header.menuItems", data.header.menuItems ?? []);
        setValue(
          "header.solutionsLabel",
          data.header.solutionsLabel ?? "Solutions",
        );
        setValue(
          "header.systemsLabel",
          data.header.systemsLabel ?? "Longevity Systems",
        );
        setValue(
          "header.industriesLabel",
          data.header.industriesLabel ?? "Industries We Serve",
        );
        setValue("header.solutions", data.header.solutions ?? []);
        setValue("header.systems", data.header.systems ?? []);
        setValue("header.industries", data.header.industries ?? []);
        setValue("footer.quickLinks", data.footer.quickLinks ?? []);
        setValue(
          "footer.solutionsLabel",
          data.footer.solutionsLabel ?? "Solutions",
        );
        setValue(
          "footer.systemsLabel",
          data.footer.systemsLabel ?? "Longevity Systems",
        );
        setValue("footer.solutions", data.footer.solutions ?? []);
        setValue("footer.systems", data.footer.systems ?? []);
      } else {
        toast.error("Failed to fetch settings");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onSubmit = async (data: GlobalSettingsForm) => {
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
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Contact</Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Email</Label>
            <Input
              {...register("contact.email")}
              placeholder="mail@example.com"
            />
            <Label className="font-bold">Phone</Label>
            <Input {...register("contact.phone")} placeholder="+971..." />
            <Label className="font-bold">Address (Footer only)</Label>
            <Textarea
              {...register("contact.address")}
              placeholder="Address"
              rows={3}
            />
          </div>
        </AdminItemContainer>

        {/* ── Socials ─────────────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Social Media</Label>
          <div className="p-5 flex flex-col gap-3">
            {socials.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-lg p-3"
              >
                <Controller
                  control={control}
                  name={`socials.${index}.isHidden`}
                  render={({ field: f }) => (
                    <EyeToggle value={f.value} onChange={f.onChange} />
                  )}
                />
                <Input
                  {...register(`socials.${index}.label`)}
                  placeholder="Facebook"
                  className="flex-1"
                />
                <Input
                  {...register(`socials.${index}.link`)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <RiDeleteBin6Line
                  className="text-red-400 cursor-pointer hover:scale-110 transition-all shrink-0"
                  size={18}
                  onClick={() => removeSocial(index)}
                />
              </div>
            ))}
            <div className="flex justify-end">
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
                + Add Social
              </Button>
            </div>
          </div>
        </AdminItemContainer>

        {/* ── Header Nav Links ─────────────────────────────────────────────── */}
        <AdminItemContainer>
          <div className="flex items-center justify-between p-5">
            <Label main>Header Menu</Label>
            <Button type="button" onClick={() => setReorderOpen(true)}>
              Reorder / Edit Links
            </Button>
          </div>
          <div className="px-5 pb-5 flex flex-col gap-2">
            {(watch("header.menuItems") ?? []).map((item, i) => (
              <div
                key={item._id ?? i}
                className="text-sm text-black/60 border border-black/10 rounded px-3 py-2"
              >
                {item.kind === "link"
                  ? item.label || "Untitled Link"
                  : item.groupKey === "solutions"
                    ? watch("header.solutionsLabel") || "Solutions"
                    : item.groupKey === "systems"
                      ? watch("header.systemsLabel") || "Longevity Systems"
                      : watch("header.industriesLabel") ||
                        "Industries We Serve"}
                {item.isHidden && (
                  <span className="text-red-400"> (hidden)</span>
                )}
              </div>
            ))}
          </div>
        </AdminItemContainer>

        {/* ── Header Solutions ─────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Header — Solutions</Label>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                {...register("header.solutionsLabel")}
                placeholder="Solutions"
              />
            </div>
            {headerSolutions.length === 0 && (
              <p className="text-sm text-black/40">No solutions found.</p>
            )}
            {headerSolutions.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-md px-4 py-3"
              >
                <Controller
                  control={control}
                  name={`header.solutions.${index}.isHidden`}
                  render={({ field: f }) => (
                    <EyeToggle value={f.value} onChange={f.onChange} />
                  )}
                />
                <span className="text-sm">
                  {watch(`header.solutions.${index}.thumbnailTitle`) ||
                    "Untitled Solution"}
                </span>
              </div>
            ))}
          </div>
        </AdminItemContainer>

        {/* ── Header Systems ───────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Header — Longevity Systems</Label>
          <div className="p-5 flex flex-col gap-2">
            {headerSystems.length === 0 && (
              <p className="text-sm text-black/40">
                No system categories found.
              </p>
            )}
            {headerSystems.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-md px-4 py-3"
              >
                <Controller
                  control={control}
                  name={`header.systems.${index}.isHidden`}
                  render={({ field: f }) => (
                    <EyeToggle value={f.value} onChange={f.onChange} />
                  )}
                />
                <span className="text-sm">
                  {watch(`header.systems.${index}.title`) ||
                    "Untitled Category"}
                </span>
              </div>
            ))}
          </div>
        </AdminItemContainer>

        {/* ── Header Industries ────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Header — Industries</Label>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                {...register("header.industriesLabel")}
                placeholder="Industries We Serve"
              />
            </div>
            {headerIndustries.length === 0 && (
              <p className="text-sm text-black/40">No industries found.</p>
            )}
            {headerIndustries.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-md px-4 py-3"
              >
                <Controller
                  control={control}
                  name={`header.industries.${index}.isHidden`}
                  render={({ field: f }) => (
                    <EyeToggle value={f.value} onChange={f.onChange} />
                  )}
                />
                <span className="text-sm">
                  {watch(`header.industries.${index}.thumbnailTitle`) ||
                    "Untitled Industry"}
                </span>
              </div>
            ))}
          </div>
        </AdminItemContainer>

        {/* ── Footer Solutions ─────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Footer — Solutions</Label>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                {...register("footer.solutionsLabel")}
                placeholder="Solutions"
              />
            </div>
            {footerSolutions.length === 0 && (
              <p className="text-sm text-black/40">No solutions found.</p>
            )}
            {footerSolutions.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-md px-4 py-3"
              >
                <Controller
                  control={control}
                  name={`footer.solutions.${index}.isHidden`}
                  render={({ field: f }) => (
                    <EyeToggle value={f.value} onChange={f.onChange} />
                  )}
                />
                <span className="text-sm">
                  {watch(`footer.solutions.${index}.thumbnailTitle`) ||
                    "Untitled Solution"}
                </span>
              </div>
            ))}
          </div>
        </AdminItemContainer>

        {/* ── Footer Systems ───────────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Footer — Longevity Systems</Label>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                {...register("footer.systemsLabel")}
                placeholder="Longevity Systems"
              />
            </div>
            {footerSystems.length === 0 && (
              <p className="text-sm text-black/40">
                No system categories found.
              </p>
            )}
            {footerSystems.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-md px-4 py-3"
              >
                <Controller
                  control={control}
                  name={`footer.systems.${index}.isHidden`}
                  render={({ field: f }) => (
                    <EyeToggle value={f.value} onChange={f.onChange} />
                  )}
                />
                <span className="text-sm">
                  {watch(`footer.systems.${index}.title`) ||
                    "Untitled Category"}
                </span>
              </div>
            ))}
          </div>
        </AdminItemContainer>

        {/* ── Footer Quick Links ───────────────────────────────────────────── */}
        <AdminItemContainer>
          <Label main>Footer — Quick Links</Label>
          <div className="p-5 flex flex-col gap-3">
            {quickLinks.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border border-black/10 rounded-lg p-3"
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
                  placeholder="/about"
                  className="flex-1"
                />
                <RiDeleteBin6Line
                  className="text-red-400 cursor-pointer hover:scale-110 transition-all shrink-0"
                  size={18}
                  onClick={() => removeQuickLink(index)}
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendQuickLink({ label: "", link: "", isHidden: false })
                }
              >
                + Add Quick Link
              </Button>
            </div>
          </div>
        </AdminItemContainer>

        <div className="fixed top-4 right-8 z-50">
          <Button
            type="submit"
            className="cursor-pointer border-2 border-white hover:text-white text-[14px] shadow-lg"
          >
            Save Settings
          </Button>
        </div>
      </form>
      <ReorderNavLinksDialog
        open={reorderOpen}
        onClose={() => setReorderOpen(false)}
        menuItems={watch("header.menuItems") ?? []}
        labels={{
          solutions: watch("header.solutionsLabel") || "Solutions",
          systems: watch("header.systemsLabel") || "Longevity Systems",
          industries: watch("header.industriesLabel") || "Industries We Serve",
        }}
        onSaved={(items) => setValue("header.menuItems", items)}
      />
    </div>
  );
}
