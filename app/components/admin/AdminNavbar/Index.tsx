"use client";

import ClientSideLink from "@/app/(admin)/admin/client-side-link";
import { useEffect, useState } from "react";
import {
  Home,
  Info,
  Phone,
  Settings,
  Briefcase,
  Factory,
  Star,
  GraduationCap,
} from "lucide-react";

interface SolutionItem {
  _id: string;
  bannerSection: {
    title: string;
  };
  isHidden: boolean;
}

const AdminNavbar = () => {
  const [openLink, setOpenLink] = useState<string | null>(null);
  // const [solutionsList, setSolutionsList] = useState<SolutionItem[]>([]);

  // useEffect(() => {
  //   fetch("/api/admin/solution")
  //     .then((r) => r.json())
  //     .then((d) => setSolutionsList(d.data?.solutions || []))
  //     .catch(console.error);
  // }, []);

  const navItems = [
    { name: "Home", href: "/admin/home", icon: Home },
    { name: "About", href: "/admin/about", icon: Info },
    {
      name: "Solutions",
      href: "###",
      icon: Briefcase,
      hasChild: true,
      children: [
        { name: "Main Page", href: "/admin/solutions" },
        // ...solutionsList.map((s) => ({
        //   name: s.bannerSection.title || "Untitled",
        //   href: `/admin/solutions/${s._id}`,
        // })),
      ],
    },
    {
      name: "Systems",
      href: "###",
      icon: Settings,
      hasChild: true,
      children: [{ name: "Main Page", href: "/admin/systems" }],
    },
    {
      name: "Industries",
      href: "###",
      icon: Factory,
      hasChild: true,
      children: [{ name: "Main Page", href: "/admin/industries" }],
    },
    { name: "Experience", href: "/admin/experience", icon: Star },
    { name: "Careers", href: "/admin/careers", icon: GraduationCap },
    {
      name: "Contact",
      href: "##",
      icon: Phone,
      hasChild: true,
      children: [
        { name: "Main Page", href: "/admin/contact" },
        { name: "Enquiries", href: "/admin/contact/enquiry" },
      ],
    },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return navItems.map((item, index) => {
    const Icon = item.icon;
    return (
      <ClientSideLink
        key={index}
        href={item.href}
        name={item.name}
        icon={<Icon className="h-5 w-5" />}
        isOpen={openLink === item.href}
        setOpenLink={setOpenLink}
        hasChild={item.hasChild}
      >
        {item.children}
      </ClientSideLink>
    );
  });
};

export default AdminNavbar;
