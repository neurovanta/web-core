import EnquiriesList from "@/app/components/admin/common/EnquiriesList";

// Contact Us form submissions
export default function ContactEnquiriesPage() {
  return (
    <EnquiriesList
      config={{
        kind: "contact",
        title: "Contact Enquiries",
        nameKey: "name",
        emailKey: "email",
        phoneKey: "phoneNumber",
        messageKey: "message",
        extras: [{ key: "serviceRequired", label: "Service", filter: true }],
      }}
    />
  );
}
