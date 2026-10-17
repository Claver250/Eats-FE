"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuCategories, type MenuCategory, type MenuItem } from "../types";

export type NewMenuItem = Omit<MenuItem, "id" | "createdAt">;

type Props = {
    restaurant: string;
    editing?: MenuItem | null; // when set, the form edits this item instead of adding one
    onSave: (item: NewMenuItem) => void;
    onCancel: () => void;
};

type Errors = Partial<Record<"name" | "category" | "price" | "description", string>>;

const MAX_DESCRIPTION = 500;
const MAX_INSTRUCTIONS = 200;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const inputClass = (invalid: boolean) =>
    cn(
        "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand-500",
        invalid ? "border-danger" : "border-border",
    );

function Label({
    htmlFor,
    children,
    required,
    }: {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
    }) {
    return (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {children}
        {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-danger">{message}</p>;
}

// The parent gives this component a `key` that changes with the item being edited,
// so the fields below start from `editing` each time and never need syncing.
export default function AddItemForm({ restaurant, editing, onSave, onCancel }: Props) {
    const [name, setName] = useState(editing?.name ?? "");
    const [category, setCategory] = useState<MenuCategory | "">(editing?.category ?? "");
    const [price, setPrice] = useState(editing ? String(editing.price) : "");
    const [description, setDescription] = useState(editing?.description ?? "");
    const [available, setAvailable] = useState(editing?.available ?? true);
    const [instructions, setInstructions] = useState(editing?.instructions ?? "");
    const [imageUrl, setImageUrl] = useState<string | null>(editing?.image ?? null);
    const [imageError, setImageError] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [savedName, setSavedName] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

  // Preview URL created by this form and not saved yet. Only this one is ever revoked,
  // so a saved item's photo is never broken by the form closing.
    const ownedUrl = useRef<string | null>(null);
    useEffect(() => {
        return () => {
        if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current);
        };
    }, []);

    function clearError(field: keyof Errors) {
        setSavedName("");
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function pickImage(file: File | undefined) {
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type)) {
        setImageError("Please choose a JPG or PNG image.");
        return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
        setImageError("Image is larger than 2MB.");
        return;
        }
        if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current);
        const url = URL.createObjectURL(file);
        ownedUrl.current = url;
        setImageError("");
        setImageUrl(url);
    }

    function removeImage() {
        if (ownedUrl.current) {
        URL.revokeObjectURL(ownedUrl.current);
        ownedUrl.current = null;
        }
        setImageUrl(null);
        if (fileRef.current) fileRef.current.value = "";
    }

    function validate(): Errors {
        const next: Errors = {};
        if (!name.trim()) next.name = "Item name is required.";
        if (!category) next.category = "Choose a category.";
        if (!price || Number(price) <= 0) next.price = "Enter a price above ₦0.";
        if (!description.trim()) next.description = "Add a short description.";
        return next;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0 || !category) return;

        onSave({
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        available,
        image: imageUrl ?? undefined,
        instructions: instructions.trim() || undefined,
        });

    // The saved item now owns the preview URL, so this form must not revoke it.
    ownedUrl.current = null;

    if (!editing) {
        setSavedName(name.trim());
        setName("");
        setCategory("");
        setPrice("");
        setDescription("");
        setAvailable(true);
        setInstructions("");
        setImageUrl(null);
        setErrors({});
        if (fileRef.current) fileRef.current.value = "";
        }
    }

    return (
        <section
        id="add-menu-item"
        className="scroll-mt-24 rounded-card bg-surface p-5 shadow-card"
        >
        <h2 className="text-base font-semibold">
            {editing ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>
        <p className="mt-1 text-xs text-muted">
            Make it easy for customers to find and order your best dishes.
        </p>
        <p className="mt-1 text-xs font-medium text-brand-700">
            {editing ? "Editing" : "Adding to"} {restaurant}
        </p>

        {savedName && (
            <p
            role="status"
            className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-success"
            >
            “{savedName}” was added to the menu.
            </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[150px_1fr]">
            <div>
                <input
                ref={fileRef}
                id="menu-item-image"
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => pickImage(e.target.files?.[0])}
                />
                {imageUrl ? (
                <div className="relative h-[110px] w-full overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Food preview" className="h-full w-full object-cover" />
                    <button
                    type="button"
                    aria-label="Remove image"
                    onClick={removeImage}
                    className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 shadow hover:bg-white"
                    >
                    <X className="h-3.5 w-3.5" />
                    </button>
                </div>
                ) : (
                <label
                    htmlFor="menu-item-image"
                    className="flex h-[110px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-brand-500/60 bg-brand-50/40 px-2 text-center hover:bg-brand-50"
                >
                    <ImagePlus className="h-5 w-5 text-brand-600" />
                    <span className="text-xs font-medium text-brand-700">Upload Food Image</span>
                    <span className="text-[10px] text-muted">JPG, PNG (Max 2MB)</span>
                </label>
                )}
                <FieldError message={imageError} />
            </div>

            <div>
                <Label htmlFor="menu-item-name" required>
                Item Name
                </Label>
                <input
                id="menu-item-name"
                type="text"
                maxLength={60}
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                }}
                placeholder="e.g. Jollof Rice with Chicken"
                aria-invalid={!!errors.name}
                className={inputClass(!!errors.name)}
                />
                <FieldError message={errors.name} />
            </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <Label htmlFor="menu-item-category" required>
                Category
                </Label>
                <select
                id="menu-item-category"
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value as MenuCategory | "");
                    clearError("category");
                }}
                aria-invalid={!!errors.category}
                className={cn(inputClass(!!errors.category), !category && "text-muted")}
                >
                <option value="">Select category</option>
                {menuCategories.map((c) => (
                    <option key={c} value={c}>
                    {c}
                    </option>
                ))}
                </select>
                <FieldError message={errors.category} />
            </div>

            <div>
                <Label htmlFor="menu-item-price" required>
                Price (₦)
                </Label>
                <input
                id="menu-item-price"
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => {
                    setPrice(e.target.value.replace(/\D/g, "").slice(0, 7));
                    clearError("price");
                }}
                placeholder="e.g. 4000"
                aria-invalid={!!errors.price}
                className={inputClass(!!errors.price)}
                />
                <FieldError message={errors.price} />
            </div>
            </div>

            <div>
            <Label htmlFor="menu-item-description" required>
                Description
            </Label>
            <textarea
                id="menu-item-description"
                rows={3}
                maxLength={MAX_DESCRIPTION}
                value={description}
                onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
                }}
                placeholder="Describe the dish, ingredients and any special notes..."
                aria-invalid={!!errors.description}
                className={cn(inputClass(!!errors.description), "resize-none")}
            />
            <div className="mt-1 flex items-start justify-between gap-2">
                <FieldError message={errors.description} />
                <p className="ml-auto text-xs text-muted">
                {description.length}/{MAX_DESCRIPTION}
                </p>
            </div>
            </div>

            <div>
            <p className="mb-1.5 text-sm font-medium">Availability</p>
            <div className="flex items-center gap-3">
                <button
                type="button"
                role="switch"
                aria-checked={available}
                aria-label="Available for order"
                onClick={() => {
                    setAvailable(!available);
                    setSavedName("");
                }}
                className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    available ? "bg-brand-600" : "bg-gray-300",
                )}
                >
                <span
                    className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                    available ? "left-[22px]" : "left-0.5",
                    )}
                />
                </button>
                <span className="text-sm text-muted">Available for order</span>
            </div>
            </div>

            <div>
            <Label htmlFor="menu-item-instructions">
                Special Instructions <span className="font-normal text-muted">(Optional)</span>
            </Label>
            <textarea
                id="menu-item-instructions"
                rows={2}
                maxLength={MAX_INSTRUCTIONS}
                value={instructions}
                onChange={(e) => {
                setInstructions(e.target.value);
                setSavedName("");
                }}
                placeholder="e.g. Spicy options, allergies, etc."
                className={cn(inputClass(false), "resize-none")}
            />
            <p className="mt-1 text-right text-xs text-muted">
                {instructions.length}/{MAX_INSTRUCTIONS}
            </p>
            </div>

            <div className="space-y-2 pt-1">
            <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
                {editing ? "Update Menu Item" : "Save Menu Item"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-lg border border-brand-600 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
                Cancel
            </button>
            </div>
        </form>

        <div className="mt-4 rounded-xl bg-brand-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-brand-700">
            <Lightbulb className="h-4 w-4" />
            Quick Tips
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">
            <li>Use high-quality images for better visibility.</li>
            <li>Keep descriptions clear and appetizing.</li>
            <li>Update availability regularly to avoid order issues.</li>
            </ul>
        </div>
        </section>
    );
}