import { AnimatedHeading } from "../animations/AnimateHeading";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string | string[];
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
  const descriptions = Array.isArray(description)
    ? description
    : description
      ? [description]
      : [];

  return (
    <div className="container py-120 3xl:py-150">
      <div className="flex justify-between  items-start w-full">
        <div className={`w-[42.4%] shrink-0`}>
          <div className="max-w-[88%]">
            <AnimatedHeading
              title={title}
              className={`text-heading text-secondary tracking-[0%] font-dm-regular ${maxWTitle}`}
              mode="reveal"
            />
          </div>
        </div>
        <div className={`flex flex-col gap-20 w-full`}>
          {subtitle && (
            <p
              className={`text-subHeading text-secondary tracking-[-3%] ${maxWSubtitle}`}
            >
              {subtitle}
            </p>
          )}
          <p
            className={`text-description text-secondary tracking-[-0.03em] ${maxWDescription}`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
