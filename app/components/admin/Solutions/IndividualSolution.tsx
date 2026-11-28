"use client";

import { slugify } from "@/lib/slug";
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
import AdminVisitLink from "@/app/components/admin/common/AdminVisitLink";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";

interface IndividualSolutionForm {
  isHidden: boolean;
  slug: string;
  seo: { metaTitle: string; metaDescription: string; script: string };
  thumbnailImage: string;
  thumbnailImageAlt: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
  bannerSection: {
    isHidden: boolean;
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: {
    isHidden: boolean;
    title: string;
    subTitle: string;
    description: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    items: { title: string; icon: string; iconAlt: string }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  sixthSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}

export default function IndividualSolution({
  createMode,
}: {
  createMode?: boolean;
}) {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IndividualSolutionForm>();
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);

  const {
    fields: secondItems,
    append: appendSecond,
    remove: removeSecond,
  } = useFieldArray({ control, name: "secondSection.items" });
  const {
    fields: thirdItems,
    append: appendThird,
    remove: removeThird,
  } = useFieldArray({ control, name: "thirdSection.items" });
  const {
    fields: fifthItems,
    append: appendFifth,
    remove: removeFifth,
  } = useFieldArray({ control, name: "fifthSection.items" });

  const fetchData = async () => {
    if (createMode) {
      markClean();
      return;
    }
    try {
      const res = await fetch(`/api/admin/solution?id=${id}`);
      if (res.ok) {
        const { data } = await res.json();
        setValue("isHidden", data.isHidden);
        setValue("slug", data.slug);
        setValue("thumbnailImage", data.thumbnailImage);
        setValue("thumbnailImageAlt", data.thumbnailImageAlt);
        setValue("thumbnailTitle", data.thumbnailTitle);
        setValue("thumbnailDescription", data.thumbnailDescription);
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        setValue("secondSection.items", data.secondSection?.items || []);
        setValue("thirdSection", data.thirdSection);
        setValue("thirdSection.items", data.thirdSection?.items || []);
        setValue("fourthSection", data.fourthSection);
        setValue("fifthSection", data.fifthSection);
        setValue("fifthSection.items", data.fifthSection?.items || []);
        setValue("sixthSection", data.sixthSection);
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onSubmit = async (data: IndividualSolutionForm) => {
    try {
      const res = await fetch(
        createMode ? "/api/admin/solution" : `/api/admin/solution?id=${id}`,
        {
          method: createMode ? "POST" : "PATCH",
          body: JSON.stringify(data),
        },
      );
      if (res.ok) {
        const { message } = await res.json();
        toast.success(message);
        markClean();
        if (createMode) router.push("/4dm1n-n3ur0v4nt4/solutions");
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
        <AdminVisitLink
          href={
            !createMode && watch("slug") ? `/solutions/${watch("slug")}` : null
          }
          title={
            watch("thumbnailTitle") || (createMode ? "New Solution" : null)
          }
        />
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Banner */}
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
                    {errors.bannerSection?.image && (
                      <p className="text-red-500">
                        {errors.bannerSection.image.message}
                      </p>
                    )}
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

          <AdminItemContainer>
            <Label main>Page Details</Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    {...register("slug", {
                      // clean as soon as the field is left: "Immersion Tubs" -> "immersion-tubs"
                      onBlur: (e) => setValue("slug", slugify(e.target.value)),
                    })}
                    placeholder="page-slug"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const title = watch("thumbnailTitle") || "";
                      const slug = slugify(title); // same rule as on save (lib/slug.ts)
                      setValue("slug", slug);
                    }}
                  >
                    Auto Generate
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="font-bold">Thumbnail Image</Label>
                <Controller
                  name="thumbnailImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.thumbnailImage && (
                  <p className="text-red-500">
                    {errors.thumbnailImage.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Thumbnail Image Alt</Label>
                  <Input
                    {...register("thumbnailImageAlt")}
                    placeholder="Thumbnail Image Alt"
                  />
                  {errors.thumbnailImageAlt && (
                    <p className="text-red-500">
                      {errors.thumbnailImageAlt.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Thumbnail Title</Label>
                  <Input
                    {...register("thumbnailTitle")}
                    placeholder="Thumbnail Title"
                  />
                  {errors.thumbnailTitle && (
                    <p className="text-red-500">
                      {errors.thumbnailTitle.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Thumbnail Description</Label>
                  <Input
                    {...register("thumbnailDescription")}
                    placeholder="Thumbnail Description"
                  />
                  {errors.thumbnailDescription && (
                    <p className="text-red-500">
                      {errors.thumbnailDescription.message}
                    </p>
                  )}
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
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("firstSection.title")}
                    placeholder="Title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Sub Title</Label>
                  <Input
                    {...register("firstSection.subTitle")}
                    placeholder="Sub Title"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("firstSection.description")}
                  placeholder="Description"
                />
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("secondSection.title")}
                  placeholder="Title"
                />
              </div>
              <div className="flex items-center justify-between mt-4 border border-black/20 rounded-md p-4">
                <Label className="font-bold">Items</Label>
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendSecond({ title: "", image: "", imageAlt: "" })
                  }
                >
                  Add Item
                </Button>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {secondItems.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative flex flex-col gap-4 rounded-xl border border-border-color/60 bg-cream-bg/50 p-4 pt-11"
                  >
                    <div className="absolute top-4 right-4">
                      <RiDeleteBinLine
                        className="cursor-pointer text-red-600"
                        onClick={() => removeSecond(index)}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold">Image</Label>
                        <Controller
                          name={`secondSection.items.${index}.image`}
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
                          {...register(`secondSection.items.${index}.imageAlt`)}
                          placeholder="Alt Tag"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`secondSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                  </div>
                ))}
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("thirdSection.title")}
                  placeholder="Title"
                />
              </div>
              <div className="flex items-center justify-between mt-4 border border-black/20 rounded-md p-4">
                <Label className="font-bold">Items</Label>
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendThird({ title: "", icon: "", iconAlt: "" })
                  }
                >
                  Add Item
                </Button>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {thirdItems.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative flex flex-col gap-4 rounded-xl border border-border-color/60 bg-cream-bg/50 p-4 pt-11"
                  >
                    <div className="absolute top-4 right-4">
                      <RiDeleteBinLine
                        className="cursor-pointer text-red-600"
                        onClick={() => removeThird(index)}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold">Icon</Label>
                        <Controller
                          name={`thirdSection.items.${index}.icon`}
                          control={control}
                          render={({ field }) => (
                            <ImageUploader
                              contain
                              value={field.value}
                              onChange={field.onChange}
                              isLogo
                            />
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold">Alt Tag</Label>
                        <Input
                          {...register(`thirdSection.items.${index}.iconAlt`)}
                          placeholder="Alt Tag"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`thirdSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminItemContainer>

          {/* Fourth Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("fourthSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "fourthSection.isHidden",
                  !watch("fourthSection.isHidden"),
                )
              }
            >
              Fourth Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name="fourthSection.image"
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
                      {...register("fourthSection.imageAlt")}
                      placeholder="Alt Tag"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Title</Label>
                    <Input
                      {...register("fourthSection.title")}
                      placeholder="Title"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Description</Label>
                    <Textarea
                      {...register("fourthSection.description")}
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AdminItemContainer>

          {/* Fifth Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("fifthSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "fifthSection.isHidden",
                  !watch("fifthSection.isHidden"),
                )
              }
            >
              Fifth Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("fifthSection.title")}
                  placeholder="Title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("fifthSection.description")}
                  placeholder="Description"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Items</Label>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {fifthItems.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative flex flex-col gap-4 rounded-xl border border-border-color/60 bg-cream-bg/50 p-4 pt-11"
                    >
                      <div className="absolute top-4 right-4">
                        <RiDeleteBinLine
                          className="cursor-pointer text-red-600"
                          onClick={() => removeFifth(index)}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <Label className="font-bold">Image</Label>
                          <Controller
                            name={`fifthSection.items.${index}.image`}
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
                            {...register(
                              `fifthSection.items.${index}.imageAlt`,
                            )}
                            placeholder="Alt Tag"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold">Title</Label>
                        <Input
                          {...register(`fifthSection.items.${index}.title`)}
                          placeholder="Title"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full flex justify-end">
                    <Button
                      type="button"
                      addItem
                      onClick={() =>
                        appendFifth({ title: "", image: "", imageAlt: "" })
                      }
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AdminItemContainer>

          {/* Sixth Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("sixthSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "sixthSection.isHidden",
                  !watch("sixthSection.isHidden"),
                )
              }
            >
              Sixth Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name="sixthSection.image"
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
                      {...register("sixthSection.imageAlt")}
                      placeholder="Alt Tag"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("sixthSection.title")}
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
            <AdminSubmitButton
              saving={isSubmitting}
              label={createMode ? "Create Solution" : "Save Changes"}
              savingLabel={createMode ? "Creating" : "Saving"}
            />
          </AdminPageActions>
        </form>
      </div>
    </AdminLoadable>
  );
}
