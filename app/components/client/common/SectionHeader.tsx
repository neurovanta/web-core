import { AnimatedHeading } from "../animations/AnimateHeading";
import { SectionDescription } from "../animations/SectionDescription";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  maxWTitle?: string;
  maxWSubtitle?: string;
  maxWDescription?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  maxWTitle = "",
  maxWSubtitle = "",
  maxWDescription = "",
}: SectionHeaderProps) {
  return (
    <div className="container py-120 3xl:py-150">
      <div className="flex justify-between  items-start w-full">
        <div className={`w-[40%] 3xl:w-[42.4%] shrink-0`}>
          <div className="max-w-[88%]">
            <AnimatedHeading
              title={title}
              className={`text-heading text-secondary tracking-[0%] ${maxWTitle}`}
              mode="reveal"
            />
          </div>
        </div>
        <div className={`flex flex-col gap-20 w-full`}>
          {subtitle && (
            <SectionDescription
              text={subtitle}
              className={`!text-subHeading text-secondary tracking-[-3%] whitespace-pre-line ${maxWSubtitle}`}
            />
          )}
          {description && (
            <SectionDescription
              text={description} delay={0.8}
              className={`text-description text-secondary tracking-[-0.03em] ${maxWDescription}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
