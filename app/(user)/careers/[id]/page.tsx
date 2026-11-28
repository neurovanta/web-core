import Index from "@/app/components/client/career-form/Index";
import { careersFormData } from "@/app/components/client/career-form/data";
import { getCareers } from "@/lib/services/careers.service";
import { decodeSlug, slugify } from "@/lib/slug";
import { CareerJob } from "@/app/types/career";

type Props = { params: Promise<{ id: string }> };

// "Applying For" options come from the visible CMS jobs; with none listed, the
// static list is used. The job in the URL (/careers/<job-slug>) is preselected.
const page = async ({ params }: Props) => {
  const slug = decodeSlug((await params).id);

  let jobs: CareerJob[] = [];
  try {
    const careers = await getCareers();
    jobs = (careers.secondSection?.jobs ?? []).filter(
      (job: CareerJob) => !job.isHidden && job.designation?.trim(),
    );
  } catch {
    // careers document missing: fall back to the static options
  }

  const options = jobs.length
    ? jobs.map((job) => ({ label: job.designation, value: job.designation }))
    : careersFormData.applyingForOptions;

  const selected = jobs.find((job) => slugify(job.designation) === slugify(slug));

  return (
    <Index
      applyingForOptions={options}
      defaultApplyingFor={selected?.designation ?? ""}
    />
  );
};

export default page;
