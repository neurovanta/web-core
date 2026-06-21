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
import { RiDeleteBinLine } from "react-icons/ri";
import { RiEyeLine, RiEyeOffLine, RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

interface SolutionMainForm {
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
  solutions: {
    isHidden: boolean;
    slug: string;
    thumbnailTitle: string;
  }[];
  thirdSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { image: string; imageAlt: string }[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}

export default function SolutionMainPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<SolutionMainForm>();

  const {
    fields: solutions,
    append: appendSolution,
    remove: removeSolution,
  } = useFieldArray({ control, name: "solutions" });

  const {
    fields: thirdItems,
    append: appendThird,
    remove: removeThird,
  } = useFieldArray({ control, name: "thirdSection.items" });

  const {
    fields: fourthItems,
    append: appendFourth,
    remove: removeFourth,
  } = useFieldArray({ control, name: "fourthSection.items" });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: "", label: "" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/solution");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("solutions", data.solutions);
        setValue("thirdSection", data.thirdSection);
        setValue("thirdSection.items", data.thirdSection?.items || []);
        setValue("fourthSection", data.fourthSection);
        setValue("fourthSection.items", data.fourthSection?.items || []);
        setValue("fifthSection", data.fifthSection);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: SolutionMainForm) => {
    try {
      const res = await fetch("/api/admin/solution", {
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

  const toggleSolutionVisibility = async (
    e: React.MouseEvent,
    id: string,
    index: number,
    currentValue: boolean,
  ) => {
    e.stopPropagation();

    try {
      const res = await fetch(`/api/admin/solution?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isHidden: !currentValue,
        }),
      });

      if (res.ok) {
        setValue(`solutions.${index}.isHidden`, !currentValue);

        toast.success(!currentValue ? "Solution hidden" : "Solution visible");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteSolution = async () => {
    try {
      const res = await fetch(`/api/admin/solution?id=${confirmDialog.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const index = solutions.findIndex(
          (f) => (f as typeof f & { _id?: string })._id === confirmDialog.id,
        );
        if (index !== -1) removeSolution(index);
        toast.success("Solution deleted");
        setConfirmDialog({ open: false, id: "", label: "" });
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
                {errors.bannerSection?.image && (
                  <p className="text-red-500">
                    {errors.bannerSection.image.message}
                  </p>
                )}
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
            <Label className="font-bold">Items</Label>
            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-4">
              {thirdItems.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 gap-2 relative border-b border-black/20 pb-4"
                >
                  <div className="absolute top-2 right-2">
                    <RiDeleteBinLine
                      className="cursor-pointer text-red-600"
                      onClick={() => removeThird(index)}
                    />
                  </div>
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
                    <Label className="font-bold">Alt Tag</Label>
                    <Input
                      {...register(`thirdSection.items.${index}.imageAlt`)}
                      placeholder="Alt Tag"
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
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendThird({ title: "", image: "", imageAlt: "" })
                  }
                >
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
            <Label className="font-bold">Items</Label>
            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-4">
              {fourthItems.map((field, index) => (
                <div
                  key={field.id}
                  className="relative border-b border-black/20 pb-4"
                >
                  <div className="absolute top-2 right-2">
                    <RiDeleteBinLine
                      className="cursor-pointer text-red-600"
                      onClick={() => removeFourth(index)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
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
                    <Label className="font-bold">Alt Tag</Label>
                    <Input
                      {...register(`fourthSection.items.${index}.imageAlt`)}
                      placeholder="Alt Tag"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  addItem
                  onClick={() => appendFourth({ image: "", imageAlt: "" })}
                >
                  Add Item
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
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Image</Label>
              <Controller
                name="fifthSection.image"
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
                {...register("fifthSection.imageAlt")}
                placeholder="Alt Tag"
              />
            </div>
          </div>
        </AdminItemContainer>

        {/* SEO */}
        <AdminItemContainer>
          <Label main>SEO</Label>
          <div className="p-5 flex flex-col gap-2">
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

      {/* Solutions List — outside form */}
      <div className="bg-white border border-black/20 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <Label className="text-base font-bold">Solutions</Label>
          <Button
            type="button"
            onClick={() => router.push("/admin/solutions/new")}
            addItem
          >
            + Add Solution
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {solutions.length === 0 && (
            <p className="text-sm text-black/40">No solutions added yet.</p>
          )}
          {solutions.map((field, index) => {
            const id = (field as typeof field & { _id?: string })._id;
            const title = watch(`solutions.${index}.thumbnailTitle`);
            const isHidden = watch(`solutions.${index}.isHidden`);
            return (
              <div
                key={field.id}
                className="flex items-center justify-between border border-black/10 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => id && router.push(`/admin/solutions/${id}`)}
              >
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) =>
                      id && toggleSolutionVisibility(e, id, index, isHidden)
                    }
                  >
                    {isHidden ? (
                      <RiEyeOffLine
                        className="text-gray-400 cursor-pointer hover:scale-120 transition-all"
                        size={22}
                      />
                    ) : (
                      <RiEyeLine
                        className="text-green-600 cursor-pointer hover:scale-120 transition-all"
                        size={22}
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {title || `Solution ${index + 1}`}
                  </span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    id &&
                      setConfirmDialog({
                        open: true,
                        id,
                        label: title || `Solution ${index + 1}`,
                      });
                  }}
                >
                  <RiDeleteBin6Line
                    className="text-red-400 cursor-pointer hover:scale-120 transition-all"
                    size={20}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold">Delete Solution</h2>
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
                  setConfirmDialog({ open: false, id: "", label: "" })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteSolution}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
