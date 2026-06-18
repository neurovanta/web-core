"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

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
    formState: { errors },
  } = useForm<IndustriesMainForm>();

  const { fields: industries } = useFieldArray({ control, name: "industries" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/industries");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("industries", data.industries);
        setValue("thirdSection", data.thirdSection);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
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
    } catch (error) {
      console.error(error);
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
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  )}
                />
                <Label className="font-bold">Alt Tag</Label>
                <Input {...register("bannerSection.imageAlt")} placeholder="Alt Tag" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("bannerSection.title")} placeholder="Title" />
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
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  )}
                />
                <Label className="font-bold">Alt Tag</Label>
                <Input {...register("firstSection.imageAlt")} placeholder="Alt Tag" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("firstSection.title")} placeholder="Title" />
                <Label className="font-bold">Description</Label>
                <Textarea {...register("firstSection.description")} placeholder="Description" />
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
              setValue("thirdSection.isHidden", !watch("thirdSection.isHidden"))
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
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  )}
                />
                <Label className="font-bold">Alt Tag</Label>
                <Input {...register("thirdSection.imageAlt")} placeholder="Alt Tag" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("thirdSection.title")} placeholder="Title" />
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
            <Input {...register("seo.metaDescription")} placeholder="Meta Description" />
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

      {/* Industries List — outside form */}
      <div className="bg-white border border-black/20 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <Label className="text-base font-bold">Industries</Label>
          <Button
            type="button"
            onClick={() => router.push("/admin/industries/new")}
            addItem
          >
            + Add Industry
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {industries.length === 0 && (
            <p className="text-sm text-black/40">No industries added yet.</p>
          )}
          {industries.map((field, index) => {
            const id = (field as typeof field & { _id?: string })._id;
            const title = watch(`industries.${index}.thumbnailTitle`);
            const isHidden = watch(`industries.${index}.isHidden`);
            return (
              <div
                key={field.id}
                className="flex items-center justify-between border border-black/10 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => id && router.push(`/admin/industries/${id}`)}
              >
                <div className="flex items-center gap-3">
                  <div onClick={(e) => id && toggleIndustryVisibility(e, id, index, isHidden)}>
                    {isHidden ? (
                      <RiEyeOffLine className="text-gray-400 cursor-pointer hover:scale-120 transition-all" size={22} />
                    ) : (
                      <RiEyeLine className="text-green-600 cursor-pointer hover:scale-120 transition-all" size={22} />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {title || `Industry ${index + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}