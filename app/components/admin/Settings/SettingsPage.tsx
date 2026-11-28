"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Code2, Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UnsavedLeaveGuard from "@/app/components/admin/common/UnsavedLeaveGuard";

interface ScriptsForm {
  headerScript: string;
  bodyScript: string;
}

interface EmailsForm {
  toEmailContact: string;
  toEmailCareer: string;
  toEmailHome: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const MIN_PASSWORD_LENGTH = 8;
const EMAIL = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

// one or more addresses, comma separated
const validateEmails = (value: string) => {
  const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return "Enter at least one email address";
  const bad = parts.find((p) => !EMAIL.test(p));
  return bad ? `"${bad}" is not a valid email address` : true;
};

/* ---------- small building blocks ---------- */

function CardTitle({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <Label main>
      <span className="inline-flex items-center gap-2">
        <Icon className="h-[18px] w-[18px]" />
        {children}
      </span>
    </Label>
  );
}

function CardIntro({ children }: { children: React.ReactNode }) {
  return <p className="px-6 pt-4 text-[13px] leading-relaxed text-secondary/70">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" data-form-error className="text-[12.5px] text-red-600">
      {message}
    </p>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="-mt-1 text-[12.5px] text-secondary/60">{children}</p>;
}

function CardButton({
  busy,
  icon: Icon,
  children,
  busyLabel,
}: {
  busy: boolean;
  icon: typeof Mail;
  children: React.ReactNode;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      aria-busy={busy}
      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 text-[13.5px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(81,70,62,0.8)] transition-[background-color,transform] duration-200 hover:bg-[#3f3630] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-75 disabled:active:scale-100"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {busy ? busyLabel : children}
    </button>
  );
}

function PasswordInput({
  id,
  visible,
  onToggle,
  invalid,
  ...props
}: React.ComponentProps<"input"> & { visible: boolean; onToggle: () => void; invalid?: boolean }) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("pr-11", invalid && "border-red-400 focus-visible:border-red-500")}
        aria-invalid={invalid}
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-secondary/60 transition-colors hover:bg-cream-bg hover:text-secondary"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const readMessage = async (res: Response, fallback: string) => {
  try {
    const data = await res.json();
    return (data?.message as string) || fallback;
  } catch {
    return fallback;
  }
};

/* ---------- page ---------- */

const Settings = () => {
  const [loading, setLoading] = useState(true);

  const scripts = useForm<ScriptsForm>({ defaultValues: { headerScript: "", bodyScript: "" } });
  const emails = useForm<EmailsForm>({
    defaultValues: { toEmailContact: "", toEmailCareer: "", toEmailHome: "" },
  });
  const password = useForm<PasswordForm>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [visible, setVisible] = useState<Record<keyof PasswordForm, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  // Unsaved edits (reset() after load/save sets each form's baseline): warn on
  // reload / tab close and confirm before leaving through the admin.
  const scriptsDirty = scripts.formState.isDirty;
  const emailsDirty = emails.formState.isDirty;
  const unsavedSections = [
    emailsDirty && "Notification Emails",
    scriptsDirty && "Tracking Scripts",
  ].filter(Boolean) as string[];
  const isDirty = unsavedSections.length > 0;
  const noActionsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const toggleVisible = (field: keyof PasswordForm) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  useEffect(() => {
    const load = async () => {
      try {
        const [tagRes, emailRes] = await Promise.all([
          fetch("/api/admin/tags"),
          fetch("/api/admin/emails"),
        ]);
        if (tagRes.ok) {
          const { tag } = await tagRes.json();
          scripts.reset({ headerScript: tag?.headerScript ?? "", bodyScript: tag?.bodyScript ?? "" });
        } else {
          toast.error(await readMessage(tagRes, "Failed to load scripts"));
        }
        if (emailRes.ok) {
          const { data } = await emailRes.json();
          emails.reset({
            toEmailContact: data?.toEmailContact ?? "",
            toEmailCareer: data?.toEmailCareer ?? "",
            toEmailHome: data?.toEmailHome ?? "",
          });
        } else {
          toast.error(await readMessage(emailRes, "Failed to load emails"));
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveScripts = async (data: ScriptsForm) => {
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return void toast.error(await readMessage(res, "Failed to save scripts"));
      toast.success("Scripts saved");
      scripts.reset(data);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const saveEmails = async (data: EmailsForm) => {
    try {
      const res = await fetch("/api/admin/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return void toast.error(await readMessage(res, "Failed to save emails"));
      toast.success("Notification emails saved");
      emails.reset(data);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const changePassword = async ({ currentPassword, newPassword }: PasswordForm) => {
    try {
      const res = await fetch("/api/admin/settings/check-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) return void toast.error(await readMessage(res, "Failed to change password"));
      toast.success(await readMessage(res, "Password changed"));
      password.reset();
      setVisible({ currentPassword: false, newPassword: false, confirmPassword: false });
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-[14px] text-secondary/70">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading settings
      </div>
    );
  }

  const emailErrors = emails.formState.errors;
  const passwordErrors = password.formState.errors;

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
      {/* renders only a portal dialog, no grid cell */}
      <UnsavedLeaveGuard
        active={isDirty}
        sections={unsavedSections}
        actionsRef={noActionsRef}
      />
      <div className="flex flex-col gap-5">
        {/* Notification emails */}
        <form onSubmit={emails.handleSubmit(saveEmails)} noValidate>
          <AdminItemContainer expansion={false}>
            <CardTitle icon={Mail}>Notification Emails</CardTitle>
            <CardIntro>
              Website form submissions are emailed to these addresses. Separate several addresses with commas.
            </CardIntro>
            <div className="flex flex-col gap-5 p-6">
              {(
                [
                  ["toEmailContact", "Contact form", "Contact Us page enquiries."],
                  ["toEmailCareer", "Career applications", "Job applications from the Careers page."],
                  ["toEmailHome", "Home page enquiries", "Enquiry form on the Home page."],
                ] as const
              ).map(([name, label, hint]) => (
                <div key={name} className="flex flex-col gap-2">
                  <Label htmlFor={name} className="font-bold">
                    {label}
                  </Label>
                  <FieldHint>{hint}</FieldHint>
                  <Input
                    id={name}
                    type="text"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="name@company.com"
                    aria-invalid={!!emailErrors[name]}
                    className={cn(emailErrors[name] && "border-red-400 focus-visible:border-red-500")}
                    {...emails.register(name, { validate: validateEmails })}
                  />
                  <FieldError message={emailErrors[name]?.message} />
                </div>
              ))}
              <div className="flex justify-end">
                <CardButton busy={emails.formState.isSubmitting} icon={Mail} busyLabel="Saving">
                  Save Emails
                </CardButton>
              </div>
            </div>
          </AdminItemContainer>
        </form>

        {/* Tracking scripts */}
        <form onSubmit={scripts.handleSubmit(saveScripts)}>
          <AdminItemContainer expansion={false}>
            <CardTitle icon={Code2}>Tracking Scripts</CardTitle>
            <CardIntro>
              Analytics or tracking snippets such as Google Tag Manager or Meta Pixel. Paste the full code, including
              the script tags.
            </CardIntro>
            <div className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="headerScript" className="font-bold">
                  Header Script
                </Label>
                <FieldHint>Placed inside the page head.</FieldHint>
                <Textarea
                  id="headerScript"
                  placeholder="<script>…</script>"
                  spellCheck={false}
                  className="min-h-[160px] font-mono text-[13px] leading-relaxed"
                  {...scripts.register("headerScript")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bodyScript" className="font-bold">
                  Body Script
                </Label>
                <FieldHint>Placed at the start of the page body, for example a Tag Manager noscript fallback.</FieldHint>
                <Textarea
                  id="bodyScript"
                  placeholder="<noscript>…</noscript>"
                  spellCheck={false}
                  className="min-h-[160px] font-mono text-[13px] leading-relaxed"
                  {...scripts.register("bodyScript")}
                />
              </div>
              <div className="flex justify-end">
                <CardButton busy={scripts.formState.isSubmitting} icon={Code2} busyLabel="Saving">
                  Save Scripts
                </CardButton>
              </div>
            </div>
          </AdminItemContainer>
        </form>
      </div>

      {/* Change password */}
      <form onSubmit={password.handleSubmit(changePassword)} noValidate>
        <AdminItemContainer expansion={false}>
          <CardTitle icon={KeyRound}>Change Password</CardTitle>
          <CardIntro>You stay signed in on this device after changing the password.</CardIntro>
          <div className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword" className="font-bold">
                Current Password
              </Label>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                visible={visible.currentPassword}
                onToggle={() => toggleVisible("currentPassword")}
                invalid={!!passwordErrors.currentPassword}
                {...password.register("currentPassword", { required: "Enter your current password" })}
              />
              <FieldError message={passwordErrors.currentPassword?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword" className="font-bold">
                New Password
              </Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                visible={visible.newPassword}
                onToggle={() => toggleVisible("newPassword")}
                invalid={!!passwordErrors.newPassword}
                {...password.register("newPassword", {
                  required: "Enter a new password",
                  minLength: {
                    value: MIN_PASSWORD_LENGTH,
                    message: `Use at least ${MIN_PASSWORD_LENGTH} characters`,
                  },
                  validate: (value, values) =>
                    value !== values.currentPassword || "New password must be different from the current one",
                })}
              />
              <FieldError message={passwordErrors.newPassword?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="font-bold">
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                visible={visible.confirmPassword}
                onToggle={() => toggleVisible("confirmPassword")}
                invalid={!!passwordErrors.confirmPassword}
                {...password.register("confirmPassword", {
                  required: "Confirm the new password",
                  validate: (value, values) => value === values.newPassword || "Passwords do not match",
                })}
              />
              <FieldError message={passwordErrors.confirmPassword?.message} />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="inline-flex items-center gap-1.5 text-[12.5px] text-secondary/60">
                <ShieldCheck className="h-4 w-4" />
                At least {MIN_PASSWORD_LENGTH} characters
              </p>
              <CardButton busy={password.formState.isSubmitting} icon={KeyRound} busyLabel="Updating">
                Update Password
              </CardButton>
            </div>
          </div>
        </AdminItemContainer>
      </form>
    </div>
  );
};

export default Settings;
