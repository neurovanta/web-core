"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect } from "react";

interface ContactForm {
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
    office: {
      title: string;
      address: string;
      directionLabel: string;
      directionHref: string;
      mail: string;
      phone: string;
    };
  };
  secondSection: { isHidden: boolean; map: string };
}

export default function ContactPage() {
  const { register, handleSubmit, setValue, control, watch } =
    useForm<ContactForm>();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/admin/contact", {
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
            <Label className="font-bold">Title</Label>
            <Input {...register("firstSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("firstSection.description")}
              placeholder="Description"
            />

            <div className="border border-black/10 rounded-lg p-4 flex flex-col gap-3 mt-2">
              <Label className="font-bold">Office</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Office Title</Label>
                  <Input
                    {...register("firstSection.office.title")}
                    placeholder="Office Title"
                  />
                  <Label className="font-bold">Address</Label>
                  <Textarea
                    {...register("firstSection.office.address")}
                    placeholder="Address"
                  />
                  <Label className="font-bold">Direction Label</Label>
                  <Input
                    {...register("firstSection.office.directionLabel")}
                    placeholder="Get Directions"
                  />
                  <Label className="font-bold">Direction URL</Label>
                  <Input
                    {...register("firstSection.office.directionHref")}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Email</Label>
                  <Input
                    {...register("firstSection.office.mail")}
                    placeholder="info@example.com"
                  />
                  <Label className="font-bold">Phone</Label>
                  <Input
                    {...register("firstSection.office.phone")}
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>
          </div>
        </AdminItemContainer>

        {/* Second Section — Map */}
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
            Second Section — Map
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Map Embed URL</Label>
            <Input
              {...register("secondSection.map")}
              placeholder="https://maps.google.com/embed?..."
            />
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
    </div>
  );
}
