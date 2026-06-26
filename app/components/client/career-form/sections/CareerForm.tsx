"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FloatingInput } from "@/app/components/client/common/form/FloatingInput";
import { FloatingSelect } from "@/app/components/client/common/form/FloatingSelect";
import { FloatingTextarea } from "@/app/components/client/common/form/FloatingTextarea";
import CustomButton from "@/app/components/client/common/CustomButton";
import { careersFormData } from "../data";
import Image from "next/image";
import ErrorMessage from "../../common/form/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  careerEnquirySchema,
  CareerEnquiryFormValues,
} from "@/lib/validations/careerEnquirySchema";
import { sendCareerEnquiryAction } from "@/lib/mail/actions/sendCareerEnquiryAction";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

export default function CareersForm() {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CareerEnquiryFormValues>({
    resolver: zodResolver(careerEnquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      applyingFor: "",
      yearsOfExperience: "",
      additionalInfo: "",
    },
  });

  const watchedValues = watch();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

const onSubmit = async (data: CareerEnquiryFormValues) => {
  if (!recaptchaRef.current?.getValue()) {
    toast.error("Please complete the captcha verification");
    return;
  }
  setIsSubmitting(true);
  try {
    const formData = new FormData();
    (Object.keys(data) as (keyof CareerEnquiryFormValues)[]).forEach((key) => {
      if (key === "attachment") return;
      const value = data[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    const file = fileInputRef.current?.files?.[0];
    if (file) formData.append("attachment", file);

    const result = await sendCareerEnquiryAction(formData);
    if (!result.success) throw new Error(result.message);
    toast.success("Application submitted successfully!");
    reset();
    setSelectedFileName(null);
  } catch (err) {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const { applyingForOptions, attachment } = careersFormData;

  return (
    <div className="bg-primary px-[16px] py-[60px] sm:p-50 w-full">
      <div className="flex flex-col">
        {/* Row 1: First Name + Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[40px] sm:gap-80 3xl:gap-[85px] mb-[40px] sm:mb-60">
          <FloatingInput
            id="firstName"
            label="First Name *"
            type="text"
            registration={register("firstName", {
              required: "First name is required",
            })}
            error={errors.firstName?.message}
            value={watchedValues.firstName}
          />
          <FloatingInput
            id="lastName"
            label="Last Name *"
            type="text"
            registration={register("lastName", {
              required: "Last name is required",
            })}
            error={errors.lastName?.message}
            value={watchedValues.lastName}
          />
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[40px] sm:gap-80 3xl:gap-[85px] mb-[40px] sm:mb-60">
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
          <FloatingInput
            id="phone"
            label="Phone Number *"
            type="number"
            registration={register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+\d\s\-().]{7,20}$/,
                message: "Enter a valid phone number",
              },
            })}
            error={errors.phone?.message}
            value={watchedValues.phone}
          />
        </div>

        {/* Row 3: Applying For + Years of Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[40px] sm:gap-80 3xl:gap-[85px] mb-[40px] sm:mb-60">
          <FloatingSelect
            id="applyingFor"
            label="Applying For *"
            options={applyingForOptions}
            registration={register("applyingFor", {
              required: "Please select a position",
            })}
            value={watchedValues.applyingFor}
          />
          <FloatingInput
            id="yearsOfExperience"
            label="Years of Experience *"
            type="text"
            registration={register("yearsOfExperience", {
              required: "Years of experience is required",
            })}
            error={errors.yearsOfExperience?.message}
            value={watchedValues.yearsOfExperience}
          />
        </div>

        {/* Row 4: Additional Information */}
        <div>
          <FloatingTextarea
            id="additionalInfo"
            rows={isMobile ? 3 : 4}
            label="Additional information"
            registration={register("additionalInfo")}
            error={errors.additionalInfo?.message}
            value={watchedValues.additionalInfo}
          />
        </div>

        {/* Row 5: Attachment */}
        <div className="mb-[10px] sm:mb-30 sm:pl-[9px]">
          <input
            type="file"
            accept={attachment.accept}
            className="hidden"
            {...register("attachment")}
            ref={(e) => {
              register("attachment").ref(e);
              fileInputRef.current = e;
            }}
            onChange={(e) => {
              register("attachment").onChange(e);
              const file = e.target.files?.[0];
              setSelectedFileName(file?.name ?? null);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-[21.87px] group cursor-pointer"
          >
            <span>
              <Image
                src="/assets/icons/attachment.svg"
                alt="Attachment"
                width={20}
                height={22}
                className="pointer-events-none"
              />
            </span>
            <div className="text-left gap-[2px]">
              <p className="text-description -tracking-[0.03em] text-secondary">
                {selectedFileName ?? attachment.label}
              </p>
              <p className="text-description -tracking-[0.03em] text-secondary/50">
                {attachment.hint}
              </p>
            </div>
          </button>

          <div className="h-[20px] mt-1">
            <div
              className={`transition-opacity duration-150 ${
                errors.attachment
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <ErrorMessage
                message={errors.attachment?.message as string | undefined}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          />
        </div>

        {/* Submit */}
        <div>
          <CustomButton
            label={isSubmitting ? "SUBMITTING..." : "SUBMIT"}
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
