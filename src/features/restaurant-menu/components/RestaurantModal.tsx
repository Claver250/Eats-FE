"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Building2,
  ChefHat,
  Eye,
  EyeOff,
  FileText,
  Info,
  Landmark,
  Paperclip,
  ShieldCheck,
  Store,
  X,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { banks, cities, specialties } from "../options";
import type { NewRestaurantInput } from "../types";
import {
  FIELD_ORDER,
  MAX_FILES,
  addFiles,
  emptyValues,
  formatBytes,
  normalizePhone,
  validateValues,
  type FieldKey,
  type RestaurantFormErrors,
  type RestaurantFormValues,
} from "../validation";

type Props = {
  onClose: () => void;
  onCreate: (data: NewRestaurantInput) => Promise<void> | void;
};

const controlClass = (invalid: boolean) =>
  cn(
    "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand-500",
    invalid ? "border-danger" : "border-border",
  );

function Section({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h3 className="flex items-center gap-2 border-t border-border pt-5 text-sm font-semibold first:border-t-0 first:pt-0">
      <span className="text-brand-600">{icon}</span>
      {title}
    </h3>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
        {optional && <span className="ml-1 font-normal text-muted">(Optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CreateRestaurantModal({ onClose, onCreate }: Props) {
  const [values, setValues] = useState<RestaurantFormValues>(emptyValues);
  const [errors, setErrors] = useState<RestaurantFormErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [showBvn, setShowBvn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  // Set synchronously, so a second submit can never slip in before React re-renders.
  const inFlight = useRef(false);

  const dirty = Object.values(values).some((v) => v.trim() !== "") || files.length > 0;

  // Closing with typed data asks first, so a stray Escape or click doesn’t wipe the form.
  function requestClose() {
    if (submitting) return;
    if (dirty && !window.confirm("Discard this restaurant? What you entered will be lost.")) return;
    onClose();
  }

  function set(key: FieldKey, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // Props shared by every text input and select.
  function control(key: FieldKey) {
    return {
      id: `restaurant-${key}`,
      value: values[key],
      "aria-invalid": !!errors[key],
      "aria-describedby": errors[key] ? `restaurant-${key}-error` : undefined,
    };
  }

  function takeFiles(list: FileList | File[] | null) {
    if (!list) return;
    const result = addFiles(files, Array.from(list));
    setFiles(result.files);
    setFileError(result.error);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;

    const found = validateValues(values);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`restaurant-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setFormError("");
    try {
      await onCreate({
        name: values.name.trim(),
        address: values.address.trim(),
        city: values.city,
        email: values.email.trim(),
        phone: normalizePhone(values.phone),
        specialty: values.specialty,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        accountName: values.accountName.trim(),
        bvn: values.bvn || undefined,
        registrationNumber: values.registrationNumber.trim() || undefined,
        documents: files,
      });
      onClose(); // the form unmounts here, which discards every typed value
    } catch {
      setFormError("Couldn’t create the restaurant. Please try again.");
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title="Create New Restaurant"
      description="Enter the restaurant’s business and contact information."
      icon={<Store className="h-5 w-5" />}
      onClose={requestClose}
    >
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <Section icon={<Building2 className="h-4 w-4" />} title="Business Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="restaurant-name" label="Restaurant Name" required error={errors.name}>
              <input
                {...control("name")}
                data-autofocus
                type="text"
                maxLength={60}
                autoComplete="organization"
                placeholder="e.g. The Green Kitchen"
                onChange={(e) => set("name", e.target.value)}
                className={controlClass(!!errors.name)}
              />
            </Field>

            <Field
              id="restaurant-id"
              label={
                <span className="inline-flex items-center gap-1.5">
                  Restaurant ID <span className="font-normal text-muted">(Auto generated)</span>
                  <span title="The ID is generated automatically when the restaurant is created.">
                    <Info className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  </span>
                </span>
              }
            >
              <input
                id="restaurant-id"
                type="text"
                readOnly
                aria-readonly="true"
                placeholder="WE-REST- (will be generated)"
                className="w-full cursor-not-allowed rounded-lg border border-border bg-gray-50 px-3 py-2.5 text-sm text-muted outline-none placeholder:text-muted"
              />
            </Field>

            <Field id="restaurant-address" label="Business Address" required error={errors.address}>
              <input
                {...control("address")}
                type="text"
                maxLength={120}
                autoComplete="street-address"
                placeholder="Street, area, city"
                onChange={(e) => set("address", e.target.value)}
                className={controlClass(!!errors.address)}
              />
            </Field>

            <Field id="restaurant-city" label="Location / City" required error={errors.city}>
              <select
                {...control("city")}
                onChange={(e) => set("city", e.target.value)}
                className={cn(controlClass(!!errors.city), !values.city && "text-muted")}
              >
                <option value="">Select location</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="restaurant-email" label="Email Address" required error={errors.email}>
              <input
                {...control("email")}
                type="email"
                maxLength={100}
                autoComplete="email"
                placeholder="accounts@restaurant.com"
                onChange={(e) => set("email", e.target.value)}
                className={controlClass(!!errors.email)}
              />
            </Field>

            <Field id="restaurant-phone" label="Phone Number" required error={errors.phone}>
              <input
                {...control("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+234 801 234 5678"
                onChange={(e) => set("phone", e.target.value.replace(/[^\d+\s-]/g, "").slice(0, 20))}
                className={controlClass(!!errors.phone)}
              />
            </Field>
          </div>

          <Field id="restaurant-specialty" label="Menu Specialty" required error={errors.specialty}>
            <div className="relative">
              <ChefHat
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <select
                {...control("specialty")}
                onChange={(e) => set("specialty", e.target.value)}
                className={cn(controlClass(!!errors.specialty), "pl-9", !values.specialty && "text-muted")}
              >
                <option value="">Select specialty</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Section icon={<Landmark className="h-4 w-4" />} title="Bank & Payment Details" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="restaurant-bankName" label="Bank Name" required error={errors.bankName}>
              <select
                {...control("bankName")}
                onChange={(e) => set("bankName", e.target.value)}
                className={cn(controlClass(!!errors.bankName), !values.bankName && "text-muted")}
              >
                <option value="">Select bank</option>
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="restaurant-accountNumber" label="Account Number" required error={errors.accountNumber}>
              <input
                {...control("accountNumber")}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Enter 10 or 11 digit account number"
                onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 11))}
                className={controlClass(!!errors.accountNumber)}
              />
            </Field>

            <Field id="restaurant-accountName" label="Account Name" required error={errors.accountName}>
              <input
                {...control("accountName")}
                type="text"
                maxLength={80}
                autoComplete="off"
                placeholder="Enter account name (as on bank)"
                onChange={(e) => set("accountName", e.target.value)}
                className={controlClass(!!errors.accountName)}
              />
            </Field>

            <Field id="restaurant-bvn" label="BVN" optional error={errors.bvn}>
              <div className="relative">
                <input
                  {...control("bvn")}
                  type={showBvn ? "text" : "password"}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Enter BVN (for verification)"
                  onChange={(e) => set("bvn", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className={cn(controlClass(!!errors.bvn), "pr-10")}
                />
                <button
                  type="button"
                  aria-label={showBvn ? "Hide BVN" : "Show BVN"}
                  aria-pressed={showBvn}
                  onClick={() => setShowBvn((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
                >
                  {showBvn ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-3 text-xs text-brand-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              This account will be used for disbursement of your earnings. Ensure the details are
              correct and belong to the restaurant owner.
            </p>
          </div>

          <Section icon={<FileText className="h-4 w-4" />} title="Additional Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="restaurant-registrationNumber"
              label="Business Registration Number"
              optional
              error={errors.registrationNumber}
            >
              <input
                {...control("registrationNumber")}
                type="text"
                maxLength={20}
                autoComplete="off"
                placeholder="CAC / RC number"
                onChange={(e) => set("registrationNumber", e.target.value)}
                className={controlClass(!!errors.registrationNumber)}
              />
            </Field>

            <div>
              <p className="mb-1.5 text-xs font-medium">
                Upload Documents <span className="font-normal text-muted">(Optional)</span>
              </p>
              <input
                id="restaurant-documents"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => {
                  takeFiles(e.target.files);
                  e.target.value = ""; // lets the same file be chosen again after removing it
                }}
              />
              <label
                htmlFor="restaurant-documents"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  takeFiles(e.dataTransfer.files);
                }}
                className={cn(
                  "flex min-h-[72px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed px-3 py-3 text-center",
                  dragging ? "border-brand-600 bg-brand-50" : "border-brand-500/60 hover:bg-brand-50/60",
                )}
              >
                <span className="flex items-center gap-1.5 text-xs font-medium text-brand-700">
                  <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                  Upload files
                </span>
                <span className="text-[10px] text-muted">
                  CAC, ID, or business proof (PDF, JPG, PNG)
                </span>
              </label>
              {fileError && <p className="mt-1 text-xs text-danger">{fileError}</p>}
            </div>
          </div>

          {files.length > 0 && (
            <ul className="space-y-1.5" aria-label="Attached documents">
              {files.map((f) => (
                <li
                  key={`${f.name}-${f.size}`}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  <span className="shrink-0 text-muted">{formatBytes(f.size)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setFiles((list) => list.filter((x) => x !== f))}
                    className="rounded p-1 text-muted hover:bg-gray-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              <li className="text-[11px] text-muted">
                {files.length} of {MAX_FILES} files attached.
              </li>
            </ul>
          )}

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-danger">
              {formError}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={requestClose}
            className="flex-1 rounded-lg border border-brand-600 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create Restaurant"}
          </button>
        </div>
      </form>
    </Modal>
  );
}