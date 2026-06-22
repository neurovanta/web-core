"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RiDeleteBinLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

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
  const { register, handleSubmit, setValue, control, watch } =
    useForm<CareersForm>();
  const [jobs, setJobs] = useState<Job[]>([]);
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
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
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
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
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

  const deleteJob = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Banner Section */}
        <AdminItemContainer>
          <Label main>Banner Section</Label>
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
              setValue("firstSection.isHidden", !watch("firstSection.isHidden"))
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
              setValue("thirdSection.isHidden", !watch("thirdSection.isHidden"))
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
                      <RiDeleteBinLine size={16} />
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

        <div className="fixed top-4 right-8 z-50">
          <Button
            type="submit"
            className="cursor-pointer border-2 border-white hover:text-white text-[14px] shadow-lg"
          >
            Page Submit
          </Button>
        </div>
      </form>

      {/* Jobs list — outside form */}
      <div className="bg-white border border-black/20 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <Label className="text-base font-bold">Jobs</Label>
          <Button type="button" addItem onClick={openAddDialog}>
            + Add Job
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {jobs.length === 0 && (
            <p className="text-sm text-black/40">No jobs added yet.</p>
          )}
          {jobs.map((job) => (
            <div
              key={job._id}
              className="flex items-center justify-between border border-black/10 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openEditDialog(job)}
            >
              <div className="flex items-center gap-3">
                <div
                  onClick={(e) =>
                    job._id && toggleJobVisibility(e, job._id, job.isHidden)
                  }
                >
                  {job.isHidden ? (
                    <RiEyeOffLine
                      className="text-gray-400 cursor-pointer hover:scale-110 transition-all"
                      size={22}
                    />
                  ) : (
                    <RiEyeLine
                      className="text-green-600 cursor-pointer hover:scale-110 transition-all"
                      size={22}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {job.designation || "Untitled Position"}
                  </span>
                  <span className="text-xs text-black/40">
                    {[job.type, job.location].filter(Boolean).join(" • ")}
                  </span>
                </div>
              </div>
              <div onClick={(e) => job._id && deleteJob(e, job._id)}>
                <RiDeleteBinLine
                  className="text-red-400 cursor-pointer hover:text-red-600 hover:scale-110 transition-all"
                  size={22}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
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
  );
}
