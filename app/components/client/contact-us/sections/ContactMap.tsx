"use client";

import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVarinats";
import { ContactType } from "@/app/types/contact";

export default function ContactMap({ data }: { data: ContactType["secondSection"] }) {
  return (
    <section className="pb-[65px] lg:pb-120 3xl:pb-150 border-b border-border-color">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={moveUp(0.1)}
        className="container w-full h-[253px] sm:h-[350px] md:h-[450px] lg:h-[600px] 3xl:h-[837px] "
      >
        <iframe
          src={data.map}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </section>
  );
}
