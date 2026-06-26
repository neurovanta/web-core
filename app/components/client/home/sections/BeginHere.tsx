"use client";

import { useForm } from "react-hook-form";
import { FloatingInput } from "@/app/components/client/common/form/FloatingInput";
import { FloatingSelect } from "@/app/components/client/common/form/FloatingSelect";
import CustomButton from "@/app/components/client/common/CustomButton";
import { FloatingTextarea } from "../../common/form/FloatingTextarea";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVarinats";
import { useState, useEffect, useRef } from "react";
import { HomeType } from "@/app/types/home";
import ReCAPTCHA from "react-google-recaptcha";
import {
  HomeEnquiryFormValues,
  homeEnquirySchema,
} from "@/lib/validations/homeEnquirySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendHomeEnquiryAction } from "@/lib/mail/actions/sendHomeEnquiryAction";
import { toast } from "sonner";

const COMPANY_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "startup", label: "Startup" },
  { value: "smb", label: "Small / Medium Business" },
  { value: "enterprise", label: "Enterprise" },
  { value: "nonprofit", label: "Non-profit" },
];

export default function BeginHerePage({
  data,
}: {
  data: HomeType["ninthSection"];
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<HomeEnquiryFormValues>({
    resolver: zodResolver(homeEnquirySchema),
    defaultValues: {
      firstName: "",
      forCompany: "",
      email: "",
      phone: "",
      details: "",
    },
  });

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

  // Watch values to power floating-label state
  const watchedValues = watch();

  const onSubmit = async (data: HomeEnquiryFormValues) => {
    if (!recaptchaRef.current?.getValue()) {
      toast.error("Please complete the captcha verification");
      return;
    }
    setIsSubmitting(true);
    try {
      await sendHomeEnquiryAction(data);
      toast.success("Enquiry sent successfully!");
      reset();
      recaptchaRef.current?.reset();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary py-[60px] lg:py-120 overflow-hidden">
      {/* Headings */}
      <div className="container">
        <div className="mb-[30px] sm:mb-60 md:mb-100">
          <AnimatedHeading
            title={data.title}
            className="text-heading text-secondary mb-[5px] sm:mb-20"
          />
          <AnimatedHeading
            title={data.subtitle}
            className="text-150 text-secondary leading-none"
            mode="reveal"
          />
        </div>
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full lg:w-[66%] lg:ml-auto"
        >
          {/* Row 1 — First Name + For Company */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={moveUp(0)}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-[40px] sm:gap-y-30 gap-x-30 mb-[40px] sm:mb-60"
          >
            <FloatingInput
              id="firstName"
              label="First Name*"
              registration={register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              error={errors.firstName?.message}
              value={watchedValues.firstName}
            />
            <FloatingSelect
              id="forCompany"
              label="For Company*"
              options={COMPANY_OPTIONS}
              registration={register("forCompany", {
                required: "For company is required",
              })}
              error={errors.forCompany?.message}
              value={watchedValues.forCompany}
            />
          </motion.div>
          {/* Row 2 — Email + Phone */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={moveUp(0.1)}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-[40px] sm:gap-y-30 gap-x-30 mb-[40px] sm:mb-60"
          >
            <FloatingInput
              id="email"
              label="Email*"
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
              label="Phone*"
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
          </motion.div>
          {/* Textarea — no floating label */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={moveUp(0.15)}
            viewport={{ once: true }}
            className="mb-[10px] sm:mb-20"
          >
            <FloatingTextarea
              id="details"
              rows={isMobile ? 3 : 4}
              label="Details about your description"
              registration={register("details")}
              error={errors.details?.message}
              value={watchedValues.details}
            />
          </motion.div>

          <div className="mb-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            />
          </div>

          {/* Submit */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveUp(0.22)}
          >
            <CustomButton
              label={isSubmitting ? "SUBMITTING..." : "Send"}
              href={undefined}
              variant={3}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
          </motion.div>
        </form>
      </div>
    </section>
  );
}
