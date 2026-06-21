"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RiDraggable, RiEyeLine, RiEyeOffLine, RiDeleteBin6Line } from "react-icons/ri";

export interface MenuItem {
  _id?: string;
  kind: "link" | "group";
  label?: string;
  link?: string;
  groupKey?: "solutions" | "systems" | "industries";
  isHidden: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  labels: { solutions: string; systems: string; industries: string };
  onSaved: (items: MenuItem[]) => void;
}

function displayLabel(item: MenuItem, labels: Props["labels"]) {
  if (item.kind === "link") return item.label || "Untitled Link";
  if (item.groupKey) return labels[item.groupKey];
  return "Untitled";
}

function rowId(item: MenuItem, index: number) {
  return item._id ?? `temp-${index}`;
}

function SortableRow({
  id,
  label,
  isHidden,
  onToggleHide,
  onDelete,
}: {
  id: string;
  label: string;
  isHidden: boolean;
  onToggleHide: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-black/10 rounded-lg p-3 bg-white"
    >
      <RiDraggable
        {...attributes}
        {...listeners}
        className="cursor-grab text-black/40 shrink-0"
        size={18}
      />
      <span className="text-sm flex-1">{label}</span>
      <div onClick={onToggleHide} className="cursor-pointer shrink-0">
        {isHidden ? (
          <RiEyeOffLine className="text-gray-400" size={18} />
        ) : (
          <RiEyeLine className="text-green-600" size={18} />
        )}
      </div>
      {onDelete && (
        <RiDeleteBin6Line
          className="text-red-400 cursor-pointer shrink-0"
          size={18}
          onClick={onDelete}
        />
      )}
    </div>
  );
}

export default function ReorderNavLinksDialog({
  open,
  onClose,
  menuItems,
  labels,
  onSaved,
}: Props) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setItems(menuItems);
  }, [open, menuItems]);

  const sensors = useSensors(useSensor(PointerSensor));
  const ids = items.map((item, i) => rowId(item, i));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    setItems((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const toggleHide = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isHidden: !item.isHidden } : item,
      ),
    );
  };

  const deleteLink = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setItems((prev) => [
      ...prev,
      { kind: "link", label: "", link: "", isHidden: false },
    ]);
  };

  const updateLinkField = (
    index: number,
    field: "label" | "link",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = async () => {
    const invalidLink = items.find((i) => i.kind === "link" && !i.label?.trim());
    if (invalidLink) {
      toast.error("All links need a label");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/global-nav-items/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItems: items }),
      });
      if (res.ok) {
        const { data } = await res.json();
        toast.success("Order saved");
        onSaved(data ?? items);
        onClose();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-black/10">
          <h3 className="font-bold text-lg">Reorder Header Menu</h3>
        </div>

        <div className="p-5 flex flex-col gap-3 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              {items.map((item, i) => {
                const id = rowId(item, i);
                if (item.kind === "link") {
                  return (
                    <div key={id} className="flex flex-col gap-2">
                      <SortableRow
                        id={id}
                        label={displayLabel(item, labels)}
                        isHidden={item.isHidden}
                        onToggleHide={() => toggleHide(i)}
                        onDelete={() => deleteLink(i)}
                      />
                      <div className="flex gap-2">
                        <input
                          value={item.label ?? ""}
                          onChange={(e) => updateLinkField(i, "label", e.target.value)}
                          placeholder="Label"
                          className="text-xs border border-black/10 rounded-md px-2 py-3 flex-1"
                        />
                        <input
                          value={item.link ?? ""}
                          onChange={(e) => updateLinkField(i, "link", e.target.value)}
                          placeholder="/path"
                          className="text-xs border border-black/10 rounded-md px-2 py-3 flex-1"
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <SortableRow
                    key={id}
                    id={id}
                    label={displayLabel(item, labels)}
                    isHidden={item.isHidden}
                    onToggleHide={() => toggleHide(i)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

          <Button type="button" addItem onClick={addLink}>
            + Add Link
          </Button>
        </div>

        <div className="p-5 border-t border-black/10 flex justify-end gap-3">
          <Button type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}