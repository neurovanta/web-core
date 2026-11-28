"use client";

import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { ChevronRight, Clock, Inbox, MapPin, Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const iconBtn =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20";
import AdminTabs from "@/app/components/admin/common/AdminTabs";

interface Job {
  _id?: string;
  isHidden: boolean;
  label: string;
  designation: string;
  type: string;
  location: string;
}

interface CareersForm {
  seo: { metaTitle: string; metaDescription: string; script: string };
  bannerSection: {
    isHidden: boolean;
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: {
    isHidden: boolean;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    contactLabel: string;
    contactEmail: string;
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { image: string; imageAlt: string }[];
  };
}

export default function CareersPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<CareersForm>();
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<"jobs" | "page">("jobs");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: "",
    label: "",
  });
  const hiddenJobs = jobs.filter((j) => j.isHidden).length;
  const [jobDialog, setJobDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    job: Omit<Job, "_id"> & { _id?: string };
  }>({
    open: false,
    mode: "add",
    job: {
      isHidden: false,
      label: "",
      designation: "",
      type: "",
      location: "",
    },
  });

  const {
    fields: thirdItems,
    append: appendThird,
    remove: removeThird,
    replace: replaceThird,
  } = useFieldArray({ control, name: "thirdSection.items" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection.isHidden", data.secondSection?.isHidden);
        setValue("secondSection.title", data.secondSection?.title);
        setValue(
          "secondSection.contactLabel",
          data.secondSection?.contactLabel,
        );
        setValue(
          "secondSection.contactEmail",
          data.secondSection?.contactEmail,
        );
        setValue("thirdSection", data.thirdSection);
        setJobs(data.secondSection?.jobs || []);

        replaceThird(data.thirdSection?.items || []);
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onSubmit = async (data: CareersForm) => {
    try {
      const res = await fetch("/api/admin/careers", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { message } = await res.json();
        toast.success(message);
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const openAddDialog = () => {
    setJobDialog({
      open: true,
      mode: "add",
      job: {
        isHidden: false,
        label: "Open Roles",
        designation: "",
        type: "Full Time",
        location: "",
      },
    });
  };

  const openEditDialog = (job: Job) => {
    setJobDialog({ open: true, mode: "edit", job });
  };

  const saveJob = async () => {
    const { mode, job } = jobDialog;
    try {
      if (mode === "add") {
        const res = await fetch("/api/admin/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        });
        if (res.ok) {
          await fetchData();
          toast.success("Job added");
          setJobDialog((prev) => ({ ...prev, open: false }));
        } else {
          const { message } = await res.json();
          toast.error(message);
        }
      } else {
        const res = await fetch(`/api/admin/careers?id=${job._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        });
        if (res.ok) {
          setJobs((prev) =>
            prev.map((j) => (j._id === job._id ? { ...j, ...job } : j)),
          );
          toast.success("Job updated");
          setJobDialog((prev) => ({ ...prev, open: false }));
        } else {
          const { message } = await res.json();
          toast.error(message);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== id));
        toast.success("Job deleted");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleJobVisibility = async (
    e: React.MouseEvent,
    id: string,
    currentValue: boolean,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) =>
            j._id === id ? { ...j, isHidden: !currentValue } : j,
          ),
        );
        toast.success(!currentValue ? "Job hidden" : "Job visible");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // spinner until the page data has loaded
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchData().finally(() => setPageLoading(false));
  }, []);

  return (
    <AdminLoadable loading={pageLoading}>
      <div className="flex flex-col gap-5">
        <AdminTabs
          tabs={[
            { key: "jobs", label: "Jobs", count: jobs.length },
            { key: "page", label: "Page" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <form
          className={`flex-col gap-5 ${activeTab === "page" ? "flex" : "hidden"}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Banner Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("bannerSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "bannerSection.isHidden",
                  !watch("bannerSection.isHidden"),
                )
              }
            >
              Banner Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Image</Label>
                  <Controller
                    name="bannerSection.image"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label className="font-bold">Alt Tag</Label>
                  <Input
                    {...register("bannerSection.imageAlt")}
                    placeholder="Alt Tag"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("bannerSection.title")}
                    placeholder="Title"
                  />
                </div>
              </div>
            </div>
          </AdminItemContainer>

          {/* First Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("firstSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "firstSection.isHidden",
                  !watch("firstSection.isHidden"),
                )
              }
            >
              First Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Image</Label>
                  <Controller
                    name="firstSection.image"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label className="font-bold">Alt Tag</Label>
                  <Input
                    {...register("firstSection.imageAlt")}
                    placeholder="Alt Tag"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("firstSection.title")}
                    placeholder="Title"
                  />
                  <Label className="font-bold">Description</Label>
                  <Textarea
                    {...register("firstSection.description")}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
          </AdminItemContainer>

          {/* Second Section — Open Positions header */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("secondSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "secondSection.isHidden",
                  !watch("secondSection.isHidden"),
                )
              }
            >
              Second Section — Open Positions
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <Label className="font-bold">Title</Label>
              <Input {...register("secondSection.title")} placeholder="Title" />
              <Label className="font-bold">Contact Label</Label>
              <Input
                {...register("secondSection.contactLabel")}
                placeholder="Or Contact With"
              />
              <Label className="font-bold">Contact Email</Label>
              <Input
                {...register("secondSection.contactEmail")}
                placeholder="info@example.com"
              />
            </div>
          </AdminItemContainer>

          {/* Third Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("thirdSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "thirdSection.isHidden",
                  !watch("thirdSection.isHidden"),
                )
              }
            >
              Third Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <Label className="font-bold">Title</Label>
              <Input {...register("thirdSection.title")} placeholder="Title" />
              <Label className="font-bold">Description</Label>
              <Textarea
                {...register("thirdSection.description")}
                placeholder="Description"
              />
              <div className="flex items-center justify-between mt-2 border border-black/10 rounded-lg p-4 shadow-md">
                <Label className="font-bold">Items</Label>
                <Button
                  type="button"
                  addItem
                  onClick={() => appendThird({ image: "", imageAlt: "" })}
                >
                  + Add Item
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {thirdItems.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">Item {index + 1}</Label>
                      <Button
                        type="button"
                        onClick={() => removeThird(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin6Line size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold">Image</Label>
                        <Controller
                          name={`thirdSection.items.${index}.image`}
                          control={control}
                          render={({ field }) => (
                            <ImageUploader
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-bold">Image Alt</Label>
                        <Input
                          {...register(`thirdSection.items.${index}.imageAlt`)}
                          placeholder="Image Alt"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminItemContainer>

          {/* SEO */}
          <AdminItemContainer>
            <Label main>SEO</Label>
            <div className="p-5 flex flex-col gap-4">
              <Label className="font-bold">Meta Title</Label>
              <Input {...register("seo.metaTitle")} placeholder="Meta Title" />
              <Label className="font-bold">Meta Description</Label>
              <Input
                {...register("seo.metaDescription")}
                placeholder="Meta Description"
              />
              <Label className="font-bold">Script</Label>
              <Textarea {...register("seo.script")} placeholder="Script" />
            </div>
          </AdminItemContainer>

          <AdminPageActions isDirty={isDirty} changes={changes}>
            <AdminSubmitButton saving={isSubmitting} />
          </AdminPageActions>
        </form>

        {/* Jobs list — outside form; actions save through their own requests */}
        <div
          className={cn(
            "flex-col overflow-hidden rounded-2xl border border-border-color/50 bg-white shadow-[0_1px_2px_rgba(81,70,62,0.05),0_10px_30px_-14px_rgba(81,70,62,0.16)]",
            activeTab === "jobs" ? "flex" : "hidden",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-color/50 px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[16px] font-semibold text-secondary">Jobs</h2>
              <p className="text-[12.5px] text-secondary/60">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                {hiddenJobs > 0 && ` · ${hiddenJobs} hidden`} · click a row to
                edit. Show / hide and delete save straight away.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddDialog}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-[13.5px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(81,70,62,0.8)] transition-colors hover:bg-[#3f3630] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20"
            >
              <Plus className="h-4 w-4" />
              Add Job
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center text-sm text-secondary/60">
              <Inbox className="h-8 w-8 text-secondary/30" />
              No jobs yet. Add one to list it on the careers page.
            </div>
          ) : (
            <ul className="divide-y divide-border-color/40">
              {jobs.map((job, index) => {
                const label = job.designation || "Untitled position";
                return (
                  <li
                    key={job._id ?? index}
                    role="button"
                    tabIndex={0}
                    title="Edit job"
                    onClick={() => openEditDialog(job)}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openEditDialog(job);
                      }
                    }}
                    className="group flex cursor-pointer items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-cream-bg/60 focus-visible:bg-cream-bg/60 focus-visible:outline-none"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span className="w-5 shrink-0 text-right text-[12px] tabular-nums text-secondary/40">
                        {index + 1}
                      </span>

                      <button
                        type="button"
                        title={
                          job.isHidden
                            ? "Hidden on the website - click to show"
                            : "Visible on the website - click to hide"
                        }
                        aria-label={
                          job.isHidden ? `Show ${label}` : `Hide ${label}`
                        }
                        onClick={(e) =>
                          job._id &&
                          toggleJobVisibility(e, job._id, job.isHidden)
                        }
                        className={cn(
                          iconBtn,
                          "border",
                          job.isHidden
                            ? "border-border-color/70 bg-white text-gray-400 hover:text-gray-600"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
                        )}
                      >
                        {job.isHidden ? (
                          <RiEyeOffLine size={16} />
                        ) : (
                          <RiEyeLine size={16} />
                        )}
                      </button>

                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={cn(
                              "truncate text-[14.5px]",
                              job.isHidden
                                ? "text-secondary/50"
                                : "font-medium text-secondary",
                            )}
                          >
                            {label}
                          </span>
                          {job.isHidden && (
                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[12px] text-secondary/60">
                          {job.type && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cream-bg px-2 py-0.5">
                              <Clock className="h-3 w-3" />
                              {job.type}
                            </span>
                          )}
                          {job.location && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cream-bg px-2 py-0.5">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                          )}
                          {job.label && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cream-bg px-2 py-0.5">
                              <Tag className="h-3 w-3" />
                              {job.label}
                            </span>
                          )}
                          {!job.type && !job.location && !job.label && (
                            <span className="text-amber-600">
                              No type or location yet - add them in the editor
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <span className="hidden items-center gap-1 pr-2 text-[12.5px] font-medium text-secondary/0 transition-colors group-hover:text-secondary/70 sm:flex">
                        Edit
                        <ChevronRight className="h-4 w-4" />
                      </span>
                      <button
                        type="button"
                        title="Delete job"
                        aria-label={`Delete ${label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (job._id)
                            setDeleteDialog({ open: true, id: job._id, label });
                        }}
                        className={cn(
                          iconBtn,
                          "text-red-400 hover:bg-red-50 hover:text-red-600",
                        )}
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {deleteDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
              <h2 className="text-sm font-bold">Delete Job</h2>
              <p className="text-sm text-black/60">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">
                  {deleteDialog.label}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setDeleteDialog({ open: false, id: "", label: "" })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={async () => {
                    await deleteJob(deleteDialog.id);
                    setDeleteDialog({ open: false, id: "", label: "" });
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {jobDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4">
              <h2 className="text-sm font-bold">
                {jobDialog.mode === "add" ? "New Job" : "Edit Job"}
              </h2>

              <div className="flex flex-col gap-2">
                <Label className="font-bold">Label</Label>
                <Input
                  placeholder="Open Roles"
                  value={jobDialog.job.label}
                  onChange={(e) =>
                    setJobDialog((prev) => ({
                      ...prev,
                      job: { ...prev.job, label: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="font-bold">Designation</Label>
                <Input
                  autoFocus
                  placeholder="Job Designation Name"
                  value={jobDialog.job.designation}
                  onChange={(e) =>
                    setJobDialog((prev) => ({
                      ...prev,
                      job: { ...prev.job, designation: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Type</Label>
                  <Input
                    placeholder="Full Time"
                    value={jobDialog.job.type}
                    onChange={(e) =>
                      setJobDialog((prev) => ({
                        ...prev,
                        job: { ...prev.job, type: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Location</Label>
                  <Input
                    placeholder="Location"
                    value={jobDialog.job.location}
                    onChange={(e) =>
                      setJobDialog((prev) => ({
                        ...prev,
                        job: { ...prev.job, location: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={() =>
                    setJobDialog((prev) => ({ ...prev, open: false }))
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={saveJob}
                  disabled={!jobDialog.job.designation.trim()}
                >
                  {jobDialog.mode === "add" ? "Add" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLoadable>
  );
}
