"use client";

import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import AdminTabs from "@/app/components/admin/common/AdminTabs";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiPencilLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { useRouter } from "next/navigation";
import { ChevronRight, FolderPlus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Categories & Products buttons
const iconBtn =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20";
const iconBtnSmall =
  "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20";
const addBtn =
  "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-[13.5px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(81,70,62,0.8)] transition-colors hover:bg-[#3f3630] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20";
const addBtnSmall =
  "inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-secondary/25 bg-white px-3 text-[12.5px] font-medium text-secondary transition-colors hover:border-secondary hover:bg-secondary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20";

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
    formState: { errors, isSubmitting },
  } = useForm<SystemsMainForm>();

  const [activeTab, setActiveTab] = useState<"list" | "page">("list");

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
    } catch {
      toast.error("Something went wrong. Please try again.");
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
    } catch {
      toast.error("Something went wrong. Please try again.");
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
            {
              key: "list",
              label: "Systems",
              count: categories.reduce((n, c) => n + c.products.length, 0),
            },
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

        {/* Categories & products — outside the form; saved through their own requests */}
        <div className={activeTab === "list" ? "" : "hidden"}>
          <AdminItemContainer>
            {/* Categories & products: saved immediately through their own API calls, not by the page Save button */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="font-bold">Categories & Products</Label>
                  <p className="text-[12.5px] text-secondary/60">
                    {categories.length}{" "}
                    {categories.length === 1 ? "category" : "categories"} ·{" "}
                    {categories.reduce((n, c) => n + c.products.length, 0)}{" "}
                    products. Changes here (add, rename, hide, delete) are saved
                    straight away.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryDialog({ open: true, title: "" })}
                  className={addBtn}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>

              {categories.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-color/80 bg-cream-bg/50 px-6 py-10 text-center text-sm text-secondary/60">
                  <FolderPlus className="h-7 w-7 text-secondary/30" />
                  No categories yet. Add one to start listing products.
                </div>
              )}

              {categories.map((cat, catIndex) => (
                <div
                  key={cat._id}
                  className={cn(
                    "overflow-hidden rounded-xl border bg-white transition-colors",
                    cat.isHidden
                      ? "border-border-color/50"
                      : "border-border-color/70",
                  )}
                >
                  {/* Category header */}
                  <div className="flex items-center justify-between gap-3 border-b border-border-color/50 bg-cream-bg/70 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-[12px] font-semibold text-white">
                        {catIndex + 1}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span
                          className={cn(
                            "truncate text-[14.5px] font-semibold",
                            cat.isHidden
                              ? "text-secondary/50"
                              : "text-secondary",
                          )}
                        >
                          {cat.title || "Untitled Category"}
                        </span>
                        <span className="text-[12px] text-secondary/55">
                          {cat.products.length}{" "}
                          {cat.products.length === 1 ? "product" : "products"}
                          {cat.isHidden && " · hidden on the website"}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        title={
                          cat.isHidden
                            ? "Hidden on the website - click to show"
                            : "Visible on the website - click to hide"
                        }
                        aria-label={
                          cat.isHidden ? "Show category" : "Hide category"
                        }
                        onClick={(e) =>
                          cat._id &&
                          toggleCategoryVisibility(e, cat._id, cat.isHidden)
                        }
                        className={cn(
                          iconBtn,
                          cat.isHidden
                            ? "border-border-color/70 bg-white text-gray-400 hover:text-gray-600"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
                        )}
                      >
                        {cat.isHidden ? (
                          <RiEyeOffLine size={16} />
                        ) : (
                          <RiEyeLine size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        title="Rename category"
                        aria-label="Rename category"
                        onClick={() =>
                          cat._id &&
                          setEditDialog({
                            open: true,
                            categoryId: cat._id,
                            title: cat.title,
                          })
                        }
                        className={cn(
                          iconBtn,
                          "border-border-color/70 bg-white text-secondary/70 hover:border-secondary/40 hover:text-secondary",
                        )}
                      >
                        <RiPencilLine size={16} />
                      </button>
                      <button
                        type="button"
                        title="Delete category"
                        aria-label="Delete category"
                        onClick={() =>
                          cat._id &&
                          setConfirmDialog({
                            open: true,
                            type: "category",
                            id: cat._id,
                            label: cat.title || "this category",
                          })
                        }
                        className={cn(
                          iconBtn,
                          "border-border-color/70 bg-white text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
                        )}
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                      <span
                        aria-hidden
                        className="mx-1 h-6 w-px bg-border-color/70"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `/api/admin/systems?categoryId=${cat._id}`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
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
                        className={addBtnSmall}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Product
                      </button>
                    </div>
                  </div>

                  {/* Products list */}
                  {cat.products.length === 0 ? (
                    <p className="px-4 py-5 text-center text-[13px] text-secondary/50">
                      No products in this category yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border-color/40">
                      {cat.products.map((product, productIndex) => (
                        <li
                          key={product._id}
                          role="button"
                          tabIndex={0}
                          title="Edit product"
                          onClick={() =>
                            product._id &&
                            router.push(
                              `/4dm1n-n3ur0v4nt4/systems/${product._id}`,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.target !== e.currentTarget) return;
                            if (
                              (e.key === "Enter" || e.key === " ") &&
                              product._id
                            ) {
                              e.preventDefault();
                              router.push(
                                `/4dm1n-n3ur0v4nt4/systems/${product._id}`,
                              );
                            }
                          }}
                          className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-cream-bg/60 focus-visible:bg-cream-bg/60 focus-visible:outline-none"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="w-5 shrink-0 text-right text-[12px] tabular-nums text-secondary/40">
                              {productIndex + 1}
                            </span>
                            <button
                              type="button"
                              title={
                                product.isHidden
                                  ? "Hidden on the website - click to show"
                                  : "Visible on the website - click to hide"
                              }
                              aria-label={
                                product.isHidden
                                  ? "Show product"
                                  : "Hide product"
                              }
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
                              className={cn(
                                iconBtnSmall,
                                product.isHidden
                                  ? "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                  : "text-emerald-600 hover:bg-emerald-50",
                              )}
                            >
                              {product.isHidden ? (
                                <RiEyeOffLine size={16} />
                              ) : (
                                <RiEyeLine size={16} />
                              )}
                            </button>
                            <span
                              className={cn(
                                "truncate text-[14px]",
                                product.isHidden
                                  ? "text-secondary/45"
                                  : "font-medium text-secondary",
                              )}
                            >
                              {product.thumbnailTitle || "Untitled Product"}
                            </span>
                            {product.isHidden && (
                              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <span className="flex items-center gap-1 pr-1 text-[12.5px] font-medium text-secondary/0 transition-colors group-hover:text-secondary/70">
                              Edit
                              <ChevronRight className="h-4 w-4" />
                            </span>
                            <button
                              type="button"
                              title="Delete product"
                              aria-label="Delete product"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (product._id && cat._id)
                                  setConfirmDialog({
                                    open: true,
                                    type: "product",
                                    id: product._id,
                                    categoryId: cat._id,
                                    label:
                                      product.thumbnailTitle || "this product",
                                  });
                              }}
                              className={cn(
                                iconBtnSmall,
                                "text-red-400 hover:bg-red-50 hover:text-red-600",
                              )}
                            >
                              <RiDeleteBin6Line size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </AdminItemContainer>
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
                    setEditDialog((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
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
                Delete{" "}
                {confirmDialog.type === "category" ? "Category" : "Product"}
              </h2>
              <p className="text-sm text-black/60">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">
                  {confirmDialog.label}
                </span>
                ?
                {confirmDialog.type === "category" && (
                  <span className="block mt-1 text-red-500">
                    This will also delete all products in this category.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setConfirmDialog({
                      open: false,
                      type: null,
                      id: "",
                      label: "",
                    })
                  }
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
    </AdminLoadable>
  );
}
