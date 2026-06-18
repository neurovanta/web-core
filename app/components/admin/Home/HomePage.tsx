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

interface SystemsCategory {
  _id: string;
  title: string;
  products: { _id: string; thumbnailTitle: string }[];
}

interface HomeForm {
  seo: { metaTitle: string; metaDescription: string; script: string };
  firstSection: {
    isHidden: boolean;
    video: string;
    videoAlt: string;
    posterImage: string;
    title: string;
    buttons: { label: string; href: string }[];
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    categories: string[];
    products: string[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    button: { label: string; href: string };
    items: { title: string; value: string; icon: string; iconAlt: string }[];
  };
  sixthSection: {
    isHidden: boolean;
    title: string;
    items: {
      title: string;
      description: string;
      icon: string;
      iconAlt: string;
    }[];
  };
  seventhSection: {
    isHidden: boolean;
    title: string;
    items: {
      homeAnimatedIcon: string;
      homeAnimatedIconAlt: string;
      slug: string;
      thumbnailTitle: string;
    }[];
  };
  eighthSection: {
    isHidden: boolean;
    title: string;
    row1: { image: string; imageAlt: string }[];
    row2: { image: string; imageAlt: string }[];
    row3: { image: string; imageAlt: string }[];
  };
}

export default function HomePage() {
  const { register, handleSubmit, setValue, control, watch } =
    useForm<HomeForm>();
  const [systemsCategories, setSystemsCategories] = useState<SystemsCategory[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const {
    fields: buttons,
    append: appendButton,
    remove: removeButton,
    replace: replaceButtons,
  } = useFieldArray({ control, name: "firstSection.buttons" });
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
    fields: fifthItems,
    append: appendFifth,
    remove: removeFifth,
    replace: replaceFifth,
  } = useFieldArray({ control, name: "fifthSection.items" });
  const {
    fields: sixthItems,
    append: appendSixth,
    remove: removeSixth,
    replace: replaceSixth,
  } = useFieldArray({ control, name: "sixthSection.items" });
  const {
    fields: seventhItems,
    append: appendSeventh,
    remove: removeSeventh,
    replace: replaceSeventh,
  } = useFieldArray({ control, name: "seventhSection.items" });
  const {
    fields: row1Items,
    append: appendRow1,
    remove: removeRow1,
    replace: replaceRow1,
  } = useFieldArray({ control, name: "eighthSection.row1" });
  const {
    fields: row2Items,
    append: appendRow2,
    remove: removeRow2,
    replace: replaceRow2,
  } = useFieldArray({ control, name: "eighthSection.row2" });
  const {
    fields: row3Items,
    append: appendRow3,
    remove: removeRow3,
    replace: replaceRow3,
  } = useFieldArray({ control, name: "eighthSection.row3" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/home");
      if (res.ok) {
        const { data, categories } = await res.json();
        setValue("seo", data.seo);
        setValue("firstSection", data.firstSection);
        setValue("secondSection", data.secondSection);
        setValue("thirdSection", data.thirdSection);
        setValue("fourthSection.isHidden", data.fourthSection?.isHidden);
        setValue("fourthSection.title", data.fourthSection?.title);
        setValue("fifthSection", data.fifthSection);
        setValue("sixthSection", data.sixthSection);
        setValue("seventhSection", data.seventhSection);
        setValue("eighthSection", data.eighthSection);
        setSystemsCategories(categories || []);

        replaceButtons(data.firstSection?.buttons || []);
        replaceSecond(data.secondSection?.items || []);
        replaceThird(data.thirdSection?.items || []);
        replaceFifth(data.fifthSection?.items || []);
        replaceSixth(data.sixthSection?.items || []);
        replaceSeventh(data.seventhSection?.items || []);
        replaceRow1(data.eighthSection?.row1 || []);
        replaceRow2(data.eighthSection?.row2 || []);
        replaceRow3(data.eighthSection?.row3 || []);
        const cats = (data.fourthSection?.categories || []).map((c: unknown) =>
          String(c),
        );
        const prods = (data.fourthSection?.products || []).map((p: unknown) =>
          String(p),
        );
        setSelectedCategories(cats);
        setSelectedProducts(prods);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: HomeForm) => {
    try {
      const payload = {
        ...data,
        fourthSection: {
          ...data.fourthSection,
          categories: selectedCategories,
          products: selectedProducts,
        },
      };
      const res = await fetch("/api/admin/home", {
        method: "PATCH",
        body: JSON.stringify(payload),
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

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* First Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("firstSection.isHidden")}
            onToggleHidden={() =>
              setValue("firstSection.isHidden", !watch("firstSection.isHidden"))
            }
          >
            First Section — Hero
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("firstSection.title")} placeholder="Title" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Video</Label>
                <Controller
                  name="firstSection.video"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Label className="font-bold">Video Alt</Label>
                <Input
                  {...register("firstSection.videoAlt")}
                  placeholder="Video Alt"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Poster Image</Label>
                <Controller
                  name="firstSection.posterImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Buttons</Label>
              <Button
                type="button"
                addItem
                onClick={() => appendButton({ label: "", href: "" })}
              >
                + Add Button
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {buttons.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Button {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeButton(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Label</Label>
                      <Input
                        {...register(`firstSection.buttons.${index}.label`)}
                        placeholder="Label"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">URL</Label>
                      <Input
                        {...register(`firstSection.buttons.${index}.href`)}
                        placeholder="/path"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            <Label className="font-bold">Title</Label>
            <Input {...register("secondSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("secondSection.description")}
              placeholder="Description"
            />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendSecond({ title: "", image: "", imageAlt: "" })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-4">
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
                      <Label className="font-bold">Image Alt</Label>
                      <Input
                        {...register(`secondSection.items.${index}.imageAlt`)}
                        placeholder="Image Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`secondSection.items.${index}.title`)}
                        placeholder="Title"
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
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("thirdSection.description")}
              placeholder="Description"
            />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendThird({ title: "", image: "", imageAlt: "" })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-4">
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
                      <Label className="font-bold">Image Alt</Label>
                      <Input
                        {...register(`thirdSection.items.${index}.imageAlt`)}
                        placeholder="Image Alt"
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

        {/* Fourth Section — Systems picker */}
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
            Fourth Section — Systems
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("fourthSection.title")} placeholder="Title" />
            <div className="flex flex-col gap-3 mt-2">
              {systemsCategories.length === 0 && (
                <p className="text-sm text-black/40">
                  No categories found in Systems.
                </p>
              )}
              {systemsCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`cat-${cat._id}`}
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`cat-${cat._id}`}
                      className="text-sm font-semibold cursor-pointer"
                    >
                      {cat.title || "Untitled Category"}
                    </label>
                  </div>
                  <div className="flex flex-col gap-2 pl-7">
                    {cat.products.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          id={`prod-${product._id}`}
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleProduct(product._id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <label
                          htmlFor={`prod-${product._id}`}
                          className="text-sm cursor-pointer"
                        >
                          {product.thumbnailTitle || "Untitled Product"}
                        </label>
                      </div>
                    ))}
                    {cat.products.length === 0 && (
                      <p className="text-xs text-black/30">
                        No products in this category.
                      </p>
                    )}
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
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("fifthSection.description")}
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Label</Label>
                <Input
                  {...register("fifthSection.button.label")}
                  placeholder="Label"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button URL</Label>
                <Input
                  {...register("fifthSection.button.href")}
                  placeholder="/path"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendFifth({ title: "", value: "", icon: "", iconAlt: "" })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-4">
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
                      <Label className="font-bold">Icon</Label>
                      <Controller
                        name={`fifthSection.items.${index}.icon`}
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
                        {...register(`fifthSection.items.${index}.iconAlt`)}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`fifthSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                      <Label className="font-bold">Value</Label>
                      <Input
                        {...register(`fifthSection.items.${index}.value`)}
                        placeholder="Value"
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
            <Label className="font-bold">Title</Label>
            <Input {...register("sixthSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendSixth({
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
            <div className="flex flex-col gap-4">
              {sixthItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeSixth(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Icon</Label>
                      <Controller
                        name={`sixthSection.items.${index}.icon`}
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
                        {...register(`sixthSection.items.${index}.iconAlt`)}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`sixthSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                      <Label className="font-bold">Description</Label>
                      <Textarea
                        {...register(`sixthSection.items.${index}.description`)}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        {/* Seventh Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("seventhSection.isHidden")}
            onToggleHidden={() =>
              setValue(
                "seventhSection.isHidden",
                !watch("seventhSection.isHidden"),
              )
            }
          >
            Seventh Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("seventhSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendSeventh({
                    homeAnimatedIcon: "",
                    homeAnimatedIconAlt: "",
                    slug: "",
                    thumbnailTitle: "",
                  })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {seventhItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeSeventh(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Animated Icon</Label>
                      <Controller
                        name={`seventhSection.items.${index}.homeAnimatedIcon`}
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
                        {...register(
                          `seventhSection.items.${index}.homeAnimatedIconAlt`,
                        )}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Thumbnail Title</Label>
                      <Input
                        {...register(
                          `seventhSection.items.${index}.thumbnailTitle`,
                        )}
                        placeholder="Thumbnail Title"
                      />
                      <Label className="font-bold">Slug</Label>
                      <Input
                        {...register(`seventhSection.items.${index}.slug`)}
                        placeholder="/systems/product-slug"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        {/* Eighth Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("eighthSection.isHidden")}
            onToggleHidden={() =>
              setValue(
                "eighthSection.isHidden",
                !watch("eighthSection.isHidden"),
              )
            }
          >
            Eighth Section — Logo Marquee
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("eighthSection.title")} placeholder="Title" />

            {(["row1", "row2", "row3"] as const).map((row, rowIndex) => {
              const fields = [row1Items, row2Items, row3Items][rowIndex];
              const append = [appendRow1, appendRow2, appendRow3][rowIndex];
              const remove = [removeRow1, removeRow2, removeRow3][rowIndex];
              return (
                <div key={row} className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Row {rowIndex + 1}</Label>
                    <Button
                      type="button"
                      addItem
                      onClick={() => append({ image: "", imageAlt: "" })}
                    >
                      + Add Logo
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="font-bold">Logo {index + 1}</Label>
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <RiDeleteBinLine size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <Label className="font-bold">Image</Label>
                            <Controller
                              name={`eighthSection.${row}.${index}.image`}
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
                            <Label className="font-bold">Image Alt</Label>
                            <Input
                              {...register(
                                `eighthSection.${row}.${index}.imageAlt`,
                              )}
                              placeholder="Image Alt"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
