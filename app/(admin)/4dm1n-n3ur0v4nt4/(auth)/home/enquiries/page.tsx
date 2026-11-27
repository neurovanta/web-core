import EnquiriesList from "@/app/components/admin/common/EnquiriesList";

// Home page "Begin Here" form submissions
export default function HomeEnquiriesPage() {
  return (
    <EnquiriesList
      config={{
        kind: "home",
        title: "Home Enquiries",
        nameKey: "firstName",
        emailKey: "email",
        phoneKey: "phone",
        messageKey: "details",
        extras: [{ key: "forCompany", label: "Company" }],
      }}
    />
  );
}
