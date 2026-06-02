"use client";

import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVarinats";

export default function ContactMap() {
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.089962794504!2d55.30397435396143!3d25.236167442970977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4363fc6dc14d%3A0xd8ccf098ee4aece7!2sF%26F%20-%20Oud%20metha%2099%20building!5e0!3m2!1sen!2sin!4v1779176498683!5m2!1sen!2sin"
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
