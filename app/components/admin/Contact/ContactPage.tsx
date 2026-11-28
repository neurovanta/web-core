"use client";

import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import OptionListEditor from "@/app/components/admin/common/OptionListEditor";
import { CONTACT_FORM_DEFAULTS, withDefaults } from "@/lib/cmsDefaults";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
  formSection: {
    title: string;
    submitLabel: string;
    serviceOptions: { label: string }[];
  };
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<ContactForm>();
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        // never-saved fields show the text the site currently uses
        const form = withDefaults(data.formSection, CONTACT_FORM_DEFAULTS);
        setValue("formSection.title", form.title);
        setValue("formSection.submitLabel", form.submitLabel);
        setValue(
          "formSection.serviceOptions",
          form.serviceOptions.map(({ label }) => ({ label })),
        );
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
                <div className="flex flex-col gap-4">
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
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Alt Tag</Label>
                    <Input
                      {...register("bannerSection.imageAlt")}
                      placeholder="Alt Tag"
                    />
                  </div>
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("firstSection.title")}
                  placeholder="Title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("firstSection.description")}
                  placeholder="Description"
                />
              </div>

              <div className="rounded-xl border border-border-color/60 bg-cream-bg/50 p-4 flex flex-col gap-4 mt-2">
                <Label className="font-bold">Office</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Office Title</Label>
                      <Input
                        {...register("firstSection.office.title")}
                        placeholder="Office Title"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Address</Label>
                      <Textarea
                        {...register("firstSection.office.address")}
                        placeholder="Address"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Direction Label</Label>
                      <Input
                        {...register("firstSection.office.directionLabel")}
                        placeholder="Get Directions"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Direction URL</Label>
                      <Input
                        {...register("firstSection.office.directionHref")}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Email</Label>
                      <Input
                        {...register("firstSection.office.mail")}
                        placeholder="info@example.com"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Phone</Label>
                      <Input
                        {...register("firstSection.office.phone")}
                        placeholder="+1 234 567 890"
                      />
                    </div>
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

          {/* Contact form */}
          <AdminItemContainer>
            <Label main>Contact Form</Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Form Title</Label>
                  <Input
                    {...register("formSection.title")}
                    placeholder="Form Title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Submit Button Label</Label>
                  <Input
                    {...register("formSection.submitLabel")}
                    placeholder="Submit Button Label"
                  />
                </div>
              </div>
              <OptionListEditor
                name="formSection.serviceOptions"
                label="Enquiry Types"
                hint="Options in the form's service dropdown; the chosen one is shown in the enquiry email."
                control={control}
                register={register}
              />
            </div>
          </AdminItemContainer>

          {/* SEO */}
          <AdminItemContainer>
            <Label main>SEO</Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Meta Title</Label>
                  <Input
                    {...register("seo.metaTitle")}
                    placeholder="Meta Title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Meta Description</Label>
                  <Textarea
                    {...register("seo.metaDescription")}
                    placeholder="Meta Description"
                    className="min-h-[72px]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Script</Label>
                <Textarea {...register("seo.script")} placeholder="Script" />
              </div>
            </div>
          </AdminItemContainer>

          <AdminPageActions isDirty={isDirty} changes={changes}>
            <AdminSubmitButton saving={isSubmitting} />
          </AdminPageActions>
        </form>
      </div>
    </AdminLoadable>
  );
}
