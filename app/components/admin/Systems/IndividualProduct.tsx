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
import { RiDeleteBinLine } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";

interface IndividualProductForm {
  isHidden: boolean;
  slug: string;
  thumbnailImage: string;
  thumbnailImageAlt: string;
  thumbnailTitle: string;
  seo: { metaTitle: string; metaDescription: string; script: string };
  bannerSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
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
    description: string;
  };
  thirdSection: {
    isHidden: boolean;
    items: { title: string; description: string; image: string; imageAlt: string }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    items: {
      category: string;
      title: string;
      description: string;
      items: { icon: string; iconAlt: string; title: string }[];
    }[];
    itemsTwo: { image: string; imageAlt: string }[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { image: string; imageAlt: string }[];
  };
}

export default function IndividualProduct({ createMode }: { createMode?: boolean }) {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IndividualProductForm>();

  const { fields: thirdItems, append: appendThird, remove: removeThird } =
    useFieldArray({ control, name: "thirdSection.items" });

  const { fields: fourthItems, append: appendFourth, remove: removeFourth } =
    useFieldArray({ control, name: "fourthSection.items" });

  const { fields: fourthItemsTwo, append: appendFourthTwo, remove: removeFourthTwo } =
    useFieldArray({ control, name: "fourthSection.itemsTwo" });

  const { fields: fifthItems, append: appendFifth, remove: removeFifth } =
    useFieldArray({ control, name: "fifthSection.items" });

  const fetchData = async () => {
    if (createMode) return;
    try {
      const res = await fetch(`/api/admin/systems?id=${id}`);
      if (res.ok) {
        const { data } = await res.json();
        setValue("isHidden", data.isHidden);
        setValue("slug", data.slug);
        setValue("thumbnailImage", data.thumbnailImage);
        setValue("thumbnailImageAlt", data.thumbnailImageAlt);
        setValue("thumbnailTitle", data.thumbnailTitle);
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        setValue("thirdSection", data.thirdSection);
        setValue("thirdSection.items", data.thirdSection?.items || []);
        setValue("fourthSection", data.fourthSection);
        setValue("fourthSection.items", data.fourthSection?.items || []);
        setValue("fourthSection.itemsTwo", data.fourthSection?.itemsTwo || []);
        setValue("fifthSection", data.fifthSection);
        setValue("fifthSection.items", data.fifthSection?.items || []);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: IndividualProductForm) => {
    try {
      const res = await fetch(
        createMode ? "/api/admin/systems" : `/api/admin/systems?id=${id}`,
        {
          method: createMode ? "POST" : "PATCH",
          body: JSON.stringify(data),
        },
      );
      if (res.ok) {
        const { message } = await res.json();
        toast.success(message);
        if (createMode) router.push("/admin/systems");
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

        {/* Banner */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("bannerSection.isHidden")}
            onToggleHidden={() =>
              setValue("bannerSection.isHidden", !watch("bannerSection.isHidden"))
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

        {/* Page Details */}
        <AdminItemContainer>
          <Label main>Page Details</Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Slug</Label>
            <div className="flex gap-2">
              <Input {...register("slug")} placeholder="page-slug" className="flex-1" />
              <Button
                type="button"
                onClick={() => {
                  const title = watch("thumbnailTitle") || "";
                  const slug = title
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");
                  setValue("slug", slug);
                }}
              >
                Auto Generate
              </Button>
            </div>
            {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

            <Label className="font-bold">Thumbnail Image</Label>
            <Controller
              name="thumbnailImage"
              control={control}
              render={({ field }) => (
                <ImageUploader value={field.value} onChange={field.onChange} />
              )}
            />

            <Label className="font-bold">Thumbnail Image Alt</Label>
            <Input {...register("thumbnailImageAlt")} placeholder="Thumbnail Image Alt" />

            <Label className="font-bold">Thumbnail Title</Label>
            <Input {...register("thumbnailTitle")} placeholder="Thumbnail Title" />
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
            <Label className="font-bold">Sub Title</Label>
            <Input {...register("firstSection.subTitle")} placeholder="Sub Title" />
            <Label className="font-bold">Description</Label>
            <Textarea {...register("firstSection.description")} placeholder="Description" />
          </div>
        </AdminItemContainer>

        {/* Second Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("secondSection.isHidden")}
            onToggleHidden={() =>
              setValue("secondSection.isHidden", !watch("secondSection.isHidden"))
            }
          >
            Second Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("secondSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea {...register("secondSection.description")} placeholder="Description" />
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
            <Label className="font-bold">Items</Label>
            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-4">
              {thirdItems.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b border-black/20 pb-4">
                  <div className="absolute top-2 right-2">
                    <RiDeleteBinLine className="cursor-pointer text-red-600" onClick={() => removeThird(index)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name={`thirdSection.items.${index}.image`}
                      control={control}
                      render={({ field }) => (
                        <ImageUploader value={field.value} onChange={field.onChange} />
                      )}
                    />
                    <Label className="font-bold">Alt Tag</Label>
                    <Input {...register(`thirdSection.items.${index}.imageAlt`)} placeholder="Alt Tag" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Title</Label>
                    <Input {...register(`thirdSection.items.${index}.title`)} placeholder="Title" />
                    <Label className="font-bold">Description</Label>
                    <Textarea {...register(`thirdSection.items.${index}.description`)} placeholder="Description" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button type="button" addItem onClick={() => appendThird({ title: "", description: "", image: "", imageAlt: "" })}>
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </AdminItemContainer>

        {/* Fourth Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("fourthSection.isHidden")}
            onToggleHidden={() =>
              setValue("fourthSection.isHidden", !watch("fourthSection.isHidden"))
            }
          >
            Fourth Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("fourthSection.title")} placeholder="Title" />

            <Label className="font-bold">Items</Label>
            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-4">
              {fourthItems.map((field, index) => (
                <div key={field.id} className="relative border-b border-black/20 pb-4 flex flex-col gap-3">
                  <div className="absolute top-2 right-2">
                    <RiDeleteBinLine className="cursor-pointer text-red-600" onClick={() => removeFourth(index)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Category</Label>
                      <Input {...register(`fourthSection.items.${index}.category`)} placeholder="Category" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input {...register(`fourthSection.items.${index}.title`)} placeholder="Title" />
                    </div>
                  </div>
                  <Label className="font-bold">Description</Label>
                  <Textarea {...register(`fourthSection.items.${index}.description`)} placeholder="Description" />

                  {/* Nested sub-items */}
                  <Label className="font-bold">Sub Items</Label>
                  <FourthSubItems control={control} register={register} parentIndex={index} />
                </div>
              ))}
              <div className="flex justify-end">
                <Button type="button" addItem onClick={() => appendFourth({ category: "", title: "", description: "", items: [] })}>
                  Add Item
                </Button>
              </div>
            </div>

            <Label className="font-bold">Items Two (Images)</Label>
            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-4">
              {fourthItemsTwo.map((field, index) => (
                <div key={field.id} className="relative border-b border-black/20 pb-4">
                  <div className="absolute top-2 right-2">
                    <RiDeleteBinLine className="cursor-pointer text-red-600" onClick={() => removeFourthTwo(index)} />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name={`fourthSection.itemsTwo.${index}.image`}
                      control={control}
                      render={({ field }) => (
                        <ImageUploader value={field.value} onChange={field.onChange} />
                      )}
                    />
                    <Label className="font-bold">Alt Tag</Label>
                    <Input {...register(`fourthSection.itemsTwo.${index}.imageAlt`)} placeholder="Alt Tag" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button type="button" addItem onClick={() => appendFourthTwo({ image: "", imageAlt: "" })}>
                  Add Image
                </Button>
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
              setValue("fifthSection.isHidden", !watch("fifthSection.isHidden"))
            }
          >
            Fifth Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("fifthSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea {...register("fifthSection.description")} placeholder="Description" />
            <Label className="font-bold">Items (Images)</Label>
            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-4">
              {fifthItems.map((field, index) => (
                <div key={field.id} className="relative border-b border-black/20 pb-4">
                  <div className="absolute top-2 right-2">
                    <RiDeleteBinLine className="cursor-pointer text-red-600" onClick={() => removeFifth(index)} />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name={`fifthSection.items.${index}.image`}
                      control={control}
                      render={({ field }) => (
                        <ImageUploader value={field.value} onChange={field.onChange} />
                      )}
                    />
                    <Label className="font-bold">Alt Tag</Label>
                    <Input {...register(`fifthSection.items.${index}.imageAlt`)} placeholder="Alt Tag" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button type="button" addItem onClick={() => appendFifth({ image: "", imageAlt: "" })}>
                  Add Image
                </Button>
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
            {createMode ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Separate component for nested fourth section sub-items
function FourthSubItems({
  control,
  register,
  parentIndex,
}: {
  control: any;
  register: any;
  parentIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fourthSection.items.${parentIndex}.items`,
  });

  return (
    <div className="border border-black/10 p-2 rounded-md flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b border-black/10 pb-3">
          <div className="absolute top-2 right-2">
            <RiDeleteBinLine className="cursor-pointer text-red-600" size={14} onClick={() => remove(index)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Icon</Label>
            <Controller
              name={`fourthSection.items.${parentIndex}.items.${index}.icon`}
              control={control}
              render={({ field }) => (
                <ImageUploader value={field.value} onChange={field.onChange} isLogo />
              )}
            />
            <Label className="font-bold">Alt Tag</Label>
            <Input {...register(`fourthSection.items.${parentIndex}.items.${index}.iconAlt`)} placeholder="Alt Tag" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Title</Label>
            <Input {...register(`fourthSection.items.${parentIndex}.items.${index}.title`)} placeholder="Title" />
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button className="!bg-primary !text-secondary" type="button" addItem onClick={() => append({ icon: "", iconAlt: "", title: "" })}>
          Add Sub Item
        </Button>
      </div>
    </div>
  );
}