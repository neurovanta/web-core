import EnquiriesList from "@/app/components/admin/common/EnquiriesList";

// Job applications from the Careers form
export default function CareerApplicationsPage() {
  return (
    <EnquiriesList
      config={{
        kind: "career",
        title: "Job Applications",
        nameKey: ["firstName", "lastName"],
        emailKey: "email",
        phoneKey: "phone",
        messageKey: "additionalInfo",
        messageLabel: "Additional Info",
        extras: [
          { key: "applyingFor", label: "Position", filter: true },
          { key: "yearsOfExperience", label: "Experience" },
        ],
        attachmentKey: "attachmentUrl",
        attachmentLabel: "CV",
      }}
    />
  );
}
