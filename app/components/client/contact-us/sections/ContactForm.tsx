"use client";

import { useForm } from "react-hook-form";
import { FloatingInput } from "@/app/components/client/common/form/FloatingInput";
import { FloatingSelect } from "@/app/components/client/common/form/FloatingSelect";
import { FloatingTextarea } from "@/app/components/client/common/form/FloatingTextarea";
import CustomButton from "@/app/components/client/common/CustomButton";
import { contactUsData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  email: string;
  serviceRequired: string;
  phoneNumber: string;
  message: string;
}

export default function ContactForm() {
  const { form } = contactUsData;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

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

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
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
            options={form.serviceOptions}
            registration={register("serviceRequired", {
              required: "Please select a service",
            })}
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

        {/* Submit */}
        <div>
          <CustomButton
            label={form.submitLabel}
            href={undefined}
            variant={3}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
}
