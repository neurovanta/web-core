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
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine, RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import AdminTabs from "@/app/components/admin/common/AdminTabs";
import AdminItemList from "@/app/components/admin/common/AdminItemList";

interface IndustriesMainForm {
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
  };
  industries: {
    isHidden: boolean;
    slug: string;
    thumbnailTitle: string;
  }[];
  thirdSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}

export default function IndustriesMainPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesMainForm>();

  const { fields: industries, remove: removeIndustry } = useFieldArray({
    control,
    name: "industries",
  });

  const [activeTab, setActiveTab] = useState<"list" | "page">("list");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string;
    index: number;
    label: string;
  }>({ open: false, id: "", index: -1, label: "" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/industries");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        setValue("industries", data.industries);
        setValue("thirdSection", data.thirdSection);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onSubmit = async (data: IndustriesMainForm) => {
    try {
      const res = await fetch("/api/admin/industries", {
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
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleIndustryVisibility = async (
    e: React.MouseEvent,
    id: string,
    index: number,
    currentValue: boolean,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/industries?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });
      if (res.ok) {
        setValue(`industries.${index}.isHidden`, !currentValue);
        toast.success(!currentValue ? "Industry hidden" : "Industry visible");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteIndustry = async () => {
    try {
      const res = await fetch(`/api/admin/industries?id=${confirmDialog.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        removeIndustry(confirmDialog.index);
        toast.success("Industry deleted");
        setConfirmDialog({ open: false, id: "", index: -1, label: "" });
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
            { key: "list", label: "Industries List", count: industries.length },
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

          {/* Second Section */}
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
              Second Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("secondSection.title")}
                    placeholder="Title"
                  />
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Image</Label>
                  <Controller
                    name="thirdSection.image"
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
                    {...register("thirdSection.imageAlt")}
                    placeholder="Alt Tag"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("thirdSection.title")}
                    placeholder="Title"
                  />
                </div>
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

          <AdminPageActions>
            <AdminSubmitButton saving={isSubmitting} />
          </AdminPageActions>
        </form>

        {/* Industries List — outside form; items save through their own requests */}
        <AdminItemList
          className={activeTab === "list" ? "" : "hidden"}
          heading="Industries"
          singular="Industry"
          sitePrefix="/industries"
          items={industries.map((field, index) => ({
            key: field.id,
            id: (field as typeof field & { _id?: string })._id,
            title: watch(`industries.${index}.thumbnailTitle`),
            slug: watch(`industries.${index}.slug`),
            isHidden: watch(`industries.${index}.isHidden`),
          }))}
          onAdd={() => router.push("/4dm1n-n3ur0v4nt4/industries/new")}
          onOpen={(id) => router.push(`/4dm1n-n3ur0v4nt4/industries/${id}`)}
          onToggleVisibility={toggleIndustryVisibility}
          onDelete={(id, index, label) =>
            setConfirmDialog({ open: true, id, index, label })
          }
        />

        {confirmDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
              <h2 className="text-sm font-bold">Delete Industry</h2>
              <p className="text-sm text-black/60">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">
                  {confirmDialog.label}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setConfirmDialog({
                      open: false,
                      id: "",
                      index: -1,
                      label: "",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteIndustry}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLoadable>
  );
}
