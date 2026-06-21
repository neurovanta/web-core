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

interface AboutForm {
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
    subtitle: string;
    description: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    items: {
      title: string;
      description: string;
      icon: string;
      iconAlt: string;
    }[];
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
    items: { title: string; image: string; imageAlt: string }[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    items: { image: string; imageAlt: string }[];
  };
  sixthSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}

export default function AboutPage() {
  const { register, handleSubmit, setValue, control, watch } =
    useForm<AboutForm>();

  const {
    fields: secondItems,
    append: appendSecond,
    remove: removeSecond,
    replace: replaceSecond,
  } = useFieldArray({ control, name: "secondSection.items" });
  const {
    fields: thirdItems,
    append: appendThird,
    remove: removeThird,
    replace: replaceThird,
  } = useFieldArray({ control, name: "thirdSection.items" });
  const {
    fields: fourthItems,
    append: appendFourth,
    remove: removeFourth,
    replace: replaceFourth,
  } = useFieldArray({ control, name: "fourthSection.items" });
  const {
    fields: fifthItems,
    append: appendFifth,
    remove: removeFifth,
    replace: replaceFifth,
  } = useFieldArray({ control, name: "fifthSection.items" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/about");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        setValue("thirdSection", data.thirdSection);
        setValue("fourthSection", data.fourthSection);
        setValue("fifthSection", data.fifthSection);
        setValue("sixthSection", data.sixthSection);

        replaceSecond(data.secondSection?.items || []);
        replaceThird(data.thirdSection?.items || []);
        replaceFourth(data.fourthSection?.items || []);
        replaceFifth(data.fifthSection?.items || []);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: AboutForm) => {
    try {
      const res = await fetch("/api/admin/about", {
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
            <Label className="font-bold">Subtitle</Label>
            <Input
              {...register("firstSection.subtitle")}
              placeholder="Subtitle"
            />
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("firstSection.description")}
              placeholder="Description"
            />
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
            <Label className="font-bold">Title</Label>
            <Input {...register("secondSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendSecond({
                    title: "",
                    description: "",
                    icon: "",
                    iconAlt: "",
                  })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {secondItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeSecond(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Icon</Label>
                      <Controller
                        name={`secondSection.items.${index}.icon`}
                        control={control}
                        render={({ field }) => (
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <Label className="font-bold">Icon Alt</Label>
                      <Input
                        {...register(`secondSection.items.${index}.iconAlt`)}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`secondSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                      <Label className="font-bold">Description</Label>
                      <Textarea
                        {...register(
                          `secondSection.items.${index}.description`,
                        )}
                        placeholder="Description"
                      />
                    </div>
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
              setValue("thirdSection.isHidden", !watch("thirdSection.isHidden"))
            }
          >
            Third Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("thirdSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendThird({ title: "", icon: "", iconAlt: "" })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                      <Label className="font-bold">Icon</Label>
                      <Controller
                        name={`thirdSection.items.${index}.icon`}
                        control={control}
                        render={({ field }) => (
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <Label className="font-bold">Icon Alt</Label>
                      <Input
                        {...register(`thirdSection.items.${index}.iconAlt`)}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`thirdSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
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
            <Label className="font-bold">Title</Label>
            <Input {...register("fourthSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("fourthSection.description")}
              placeholder="Description"
            />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendFourth({ title: "", image: "", imageAlt: "" })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fourthItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeFourth(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Image</Label>
                      <Controller
                        name={`fourthSection.items.${index}.image`}
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
                        {...register(`fourthSection.items.${index}.imageAlt`)}
                        placeholder="Image Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`fourthSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() => appendFifth({ image: "", imageAlt: "" })}
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fifthItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeFifth(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label className="font-bold">Image Alt</Label>
                      <Input
                        {...register(`fifthSection.items.${index}.imageAlt`)}
                        placeholder="Image Alt"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        {/* Sixth Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("sixthSection.isHidden")}
            onToggleHidden={() =>
              setValue("sixthSection.isHidden", !watch("sixthSection.isHidden"))
            }
          >
            Sixth Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label className="font-bold">Alt Tag</Label>
                <Input
                  {...register("sixthSection.imageAlt")}
                  placeholder="Alt Tag"
                />
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
