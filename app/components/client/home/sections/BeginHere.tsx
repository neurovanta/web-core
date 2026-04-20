"use client";

import { useForm } from "react-hook-form";
import { FloatingInput } from "@/app/components/client/common/form/FloatingInput";
import { FloatingSelect } from "@/app/components/client/common/form/FloatingSelect";
import CustomButton from "@/app/components/client/common/CustomButton";
import { FloatingTextarea } from "../../common/form/FloatingTextarea";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVarinats";

interface FormData {
  firstName: string;
  forCompany: string;
  email: string;
  phone: string;
  details: string;
}

const COMPANY_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "startup", label: "Startup" },
  { value: "smb", label: "Small / Medium Business" },
  { value: "enterprise", label: "Enterprise" },
  { value: "nonprofit", label: "Non-profit" },
];

export default function BeginHerePage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      forCompany: "",
      email: "",
      phone: "",
      details: "",
    },
  });

  // Watch values to power floating-label state
  const watchedValues = watch();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: connect to API
  };

  return (
    <section className="bg-primary py-120 overflow-hidden">
      {/* Headings */}
      <div className="container">
        <div className="mb-100">

          <AnimatedHeading
            title="Where Intelligence Meets Longevity"
            className="text-heading text-secondary mb-20"
          />
          <AnimatedHeading
            title="BEGIN HERE."
            className="text-150 text-secondary leading-none"
            mode="blade"
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
           className="grid grid-cols-1 md:grid-cols-2 gap-y-30 gap-x-30 mb-60">
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
              label="For Company"
              options={COMPANY_OPTIONS}
              registration={register("forCompany")}
              value={watchedValues.forCompany}
            />
          </motion.div>
          {/* Row 2 — Email + Phone */}
          <motion.div
          initial="hidden"
          whileInView="show"
          variants={moveUp(0.1)}
           className="grid grid-cols-1 md:grid-cols-2 gap-y-30 gap-x-30 mb-60">
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
              type="tel"
              registration={register("phone", {
                required: "Phone is required",
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
           className="mb-30">
            <FloatingTextarea
              id="details"
              rows={4}
              label="Details about your description"
              registration={register("details")}
              error={errors.details?.message}
              value={watchedValues.details}
            />
          </motion.div>
          {/* Submit */}
          <motion.div
          initial="hidden"
          whileInView="show"
          variants={moveUp(0.22)}
           >
            <CustomButton label="Send" variant={3} />
          </motion.div>
        </form>
      </div>
    </section>
  );
}
