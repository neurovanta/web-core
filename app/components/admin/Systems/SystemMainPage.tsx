"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiPencilLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { useRouter } from "next/navigation";

interface SystemsMainForm {
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
    subTitle: string;
    description: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    description: string;
    categories: {
      _id?: string;
      isHidden: boolean;
      title: string;
      products: { _id?: string; isHidden: boolean; thumbnailTitle: string }[];
    }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}

export default function SystemsMainPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    SystemsMainForm["secondSection"]["categories"]
  >([]);
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean;
    title: string;
  }>({ open: false, title: "" });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    categoryId: string;
    title: string;
  }>({ open: false, categoryId: "", title: "" });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "category" | "product" | null;
    id: string;
    categoryId?: string;
    label: string;
  }>({ open: false, type: null, id: "", label: "" });
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<SystemsMainForm>();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/systems");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        setValue("thirdSection", data.thirdSection);
        setCategories(data.secondSection?.categories || []);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: SystemsMainForm) => {
    try {
      const res = await fetch("/api/admin/systems", {
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

  const toggleCategoryVisibility = async (
    e: React.MouseEvent,
    categoryId: string,
    currentValue: boolean,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/systems?categoryId=${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c._id === categoryId ? { ...c, isHidden: !currentValue } : c,
          ),
        );
        toast.success(!currentValue ? "Category hidden" : "Category visible");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleProductVisibility = async (
    e: React.MouseEvent,
    productId: string,
    currentValue: boolean,
    categoryId: string,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/systems?id=${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c._id === categoryId
              ? {
                  ...c,
                  products: c.products.map((p) =>
                    p._id === productId ? { ...p, isHidden: !currentValue } : p,
                  ),
                }
              : c,
          ),
        );
        toast.success(!currentValue ? "Product hidden" : "Product visible");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const addCategory = async () => {
    if (!categoryDialog.title.trim()) return;
    try {
      const res = await fetch("/api/admin/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: categoryDialog.title.trim(),
          isHidden: false,
        }),
      });
      if (res.ok) {
        await fetchData();
        toast.success("Category added");
        setCategoryDialog({ open: false, title: "" });
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const url =
        confirmDialog.type === "category"
          ? `/api/admin/systems?categoryId=${confirmDialog.id}`
          : `/api/admin/systems?id=${confirmDialog.id}`;

      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        if (confirmDialog.type === "category") {
          setCategories((prev) =>
            prev.filter((c) => c._id !== confirmDialog.id),
          );
          toast.success("Category deleted");
        } else {
          setCategories((prev) =>
            prev.map((c) =>
              c._id === confirmDialog.categoryId
                ? {
                    ...c,
                    products: c.products.filter(
                      (p) => p._id !== confirmDialog.id,
                    ),
                  }
                : c,
            ),
          );
          toast.success("Product deleted");
        }
        setConfirmDialog({ open: false, type: null, id: "", label: "" });
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const renameCategory = async () => {
    if (!editDialog.title.trim()) return;
    try {
      const res = await fetch(
        `/api/admin/systems?categoryId=${editDialog.categoryId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editDialog.title.trim() }),
        },
      );
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c._id === editDialog.categoryId
              ? { ...c, title: editDialog.title.trim() }
              : c,
          ),
        );
        toast.success("Category renamed");
        setEditDialog({ open: false, categoryId: "", title: "" });
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
            <Label className="font-bold">Title</Label>
            <Input {...register("firstSection.title")} placeholder="Title" />
            <Label className="font-bold">Sub Title</Label>
            <Input
              {...register("firstSection.subTitle")}
              placeholder="Sub Title"
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
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("secondSection.description")}
              placeholder="Description"
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

        <div className="fixed top-4 right-8 z-50">
          <Button
            type="submit"
            className="cursor-pointer border-2 border-white hover:text-white text-[14px] shadow-lg"
          >
            Page Submit
          </Button>
        </div>
      </form>

      {/* Second Section — outside form */}
      <div className="bg-white border border-black/20 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <Label className="text-base font-bold">
            Second Section — Categories & Products
          </Label>
          <Button
            type="button"
            addItem
            onClick={() => setCategoryDialog({ open: true, title: "" })}
          >
            + Add Category
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {categories.length === 0 && (
            <p className="text-sm text-black/40">No categories added yet.</p>
          )}
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
            >
              {/* Category header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) =>
                      cat._id &&
                      toggleCategoryVisibility(e, cat._id, cat.isHidden)
                    }
                  >
                    {cat.isHidden ? (
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
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      cat._id &&
                        setEditDialog({
                          open: true,
                          categoryId: cat._id,
                          title: cat.title,
                        });
                    }}
                  >
                    <RiPencilLine
                      className="text-blue-500 cursor-pointer hover:scale-110 transition-all"
                      size={20}
                    />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      cat._id &&
                        setConfirmDialog({
                          open: true,
                          type: "category",
                          id: cat._id,
                          label: cat.title || "this category",
                        });
                    }}
                  >
                    <RiDeleteBin6Line
                      className="text-red-400 cursor-pointer hover:scale-110 transition-all"
                      size={20}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {cat.title || "Untitled Category"}
                  </span>
                </div>
                <Button
                  type="button"
                  addItem
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `/api/admin/systems?categoryId=${cat._id}`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            thumbnailTitle: "New Product",
                            isHidden: false,
                          }),
                        },
                      );
                      if (res.ok) {
                        await fetchData();
                        toast.success("Product added");
                      } else {
                        const { message } = await res.json();
                        toast.error(message);
                      }
                    } catch {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  + Add Product
                </Button>
              </div>

              {/* Products list */}
              <div className="flex flex-col gap-2 pl-4">
                {cat.products.length === 0 && (
                  <p className="text-xs text-black/40">
                    No products in this category.
                  </p>
                )}
                {cat.products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between border border-black/10 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() =>
                      product._id &&
                      router.push(`/admin/systems/${product._id}`)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        onClick={(e) =>
                          product._id &&
                          cat._id &&
                          toggleProductVisibility(
                            e,
                            product._id,
                            product.isHidden,
                            cat._id,
                          )
                        }
                      >
                        {product.isHidden ? (
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
                      <span className="text-sm font-medium">
                        {product.thumbnailTitle || "Untitled Product"}
                      </span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        product._id &&
                          cat._id &&
                          setConfirmDialog({
                            open: true,
                            type: "product",
                            id: product._id,
                            categoryId: cat._id,
                            label: product.thumbnailTitle || "this product",
                          });
                      }}
                    >
                      <RiDeleteBin6Line
                        className="text-red-400 cursor-pointer hover:scale-110 transition-all"
                        size={20}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {categoryDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold">New Category</h2>
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Title</Label>
              <Input
                autoFocus
                placeholder="Category title"
                value={categoryDialog.title}
                onChange={(e) =>
                  setCategoryDialog((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setCategoryDialog({ open: false, title: "" })}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={addCategory}
                disabled={!categoryDialog.title.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {editDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold">Rename Category</h2>
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Title</Label>
              <Input
                autoFocus
                placeholder="Category title"
                value={editDialog.title}
                onChange={(e) =>
                  setEditDialog((prev) => ({ ...prev, title: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && renameCategory()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() =>
                  setEditDialog({ open: false, categoryId: "", title: "" })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={renameCategory}
                disabled={!editDialog.title.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
      <h2 className="text-sm font-bold">
        Delete {confirmDialog.type === "category" ? "Category" : "Product"}
      </h2>
      <p className="text-sm text-black/60">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-black">{confirmDialog.label}</span>?
        {confirmDialog.type === "category" && (
          <span className="block mt-1 text-red-500">
            This will also delete all products in this category.
          </span>
        )}
      </p>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={() => setConfirmDialog({ open: false, type: null, id: "", label: "" })}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={handleDeleteConfirm}
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
