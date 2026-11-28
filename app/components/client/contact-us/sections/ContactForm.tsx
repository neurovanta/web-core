"use client";

import { useForm } from "react-hook-form";
import { FloatingInput } from "@/app/components/client/common/form/FloatingInput";
import { FloatingSelect } from "@/app/components/client/common/form/FloatingSelect";
import { FloatingTextarea } from "@/app/components/client/common/form/FloatingTextarea";
import CustomButton from "@/app/components/client/common/CustomButton";
import {
  CONTACT_FORM_DEFAULTS,
  toSelectOptions,
  withDefaults,
} from "@/lib/cmsDefaults";
import { ContactType } from "@/app/types/contact";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { useEffect, useState } from "react";
import {
  ContactEnquiryFormValues,
  contactEnquirySchema,
} from "@/lib/validations/contactEnquirySchema";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { toast } from "sonner";
import { sendContactEnquiryAction } from "@/lib/mail/actions/sendContactEnquiryAction";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ContactForm({
  form: stored,
}: {
  form?: ContactType["formSection"];
}) {
  // CMS → Contact → Contact Form; unsaved fields show the original text
  const form = withDefaults(stored, CONTACT_FORM_DEFAULTS);
  const serviceOptions = toSelectOptions(form.serviceOptions);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactEnquiryFormValues>({
    resolver: zodResolver(contactEnquirySchema),
    defaultValues: {
      name: "",
      email: "",
      serviceRequired: "",
      phoneNumber: "",
      message: "",
    },
  });

  const watchedValues = watch();
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onSubmit = async (data: ContactEnquiryFormValues) => {
    if (!recaptchaRef.current?.getValue()) {
      toast.error("Please complete the captcha verification");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await sendContactEnquiryAction(data);
      if (!result?.success) {
        toast.error(result?.message || "Something went wrong. Please try again.");
        return; // keep the form filled so the visitor can retry
      }
      reset();
      recaptchaRef.current?.reset();
      window.location.replace("/thank-you");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-primary px-[16px] py-[60px] sm:p-50 w-full max-w-[971px]">
      <div className="flex flex-col">
        {/* Form Title */}
        <AnimatedHeading
          title={form.title}
          className="text-subHeading capitalize tracking-[-0.03em] mb-[30px] sm:mb-60"
        />

        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[40px] sm:gap-70 3xl:gap-[71px] mb-[40px] sm:mb-60">
          <FloatingInput
            id="name"
            label="Name *"
            type="text"
            registration={register("name", {
              required: "Name is required",
            })}
            error={errors.name?.message}
            value={watchedValues.name}
          />
          <FloatingInput
            id="email"
            label="Email *"
            type="email"
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={errors.email?.message}
            value={watchedValues.email}
          />
        </div>

        {/* Row 2: Service Required + Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[40px] sm:gap-70 3xl:gap-[71px] mb-[40px] sm:mb-60">
          <FloatingSelect
            id="serviceRequired"
            label="Service Required *"
            options={serviceOptions}
            registration={register("serviceRequired", {
              required: "Please select a service",
            })}
            error={errors.serviceRequired?.message}
            value={watchedValues.serviceRequired}
          />
          <FloatingInput
            id="phoneNumber"
            label="Phone Number *"
            type="number"
            registration={register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[+\d\s\-().]{7,20}$/,
                message: "Enter a valid phone number",
              },
            })}
            error={errors.phoneNumber?.message}
            value={watchedValues.phoneNumber}
          />
        </div>

        {/* Row 3: Message */}
        <div className="mb-[10px] sm:mb-20">
          <FloatingTextarea
            id="message"
            rows={isMobile ? 3 : 4}
            label="Message *"
            registration={register("message", {
              required: "Message is required",
            })}
            error={errors.message?.message}
            value={watchedValues.message}
          />
        </div>

        {/* Recaptcha */}
        <div className="mb-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          />
        </div>

        {/* Submit */}
        <div>
          <CustomButton
            label={isSubmitting ? "SUBMITTING..." : form.submitLabel}
            href={undefined}
            variant={3}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
