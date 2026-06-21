import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GlobalNavItems from "@/app/models/GlobalNavItems";
import Solution from "@/app/models/Solution";
import Systems from "@/app/models/Systems";
import Industries from "@/app/models/industries";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

function mergeOverrides<T extends { _id: any }>(
  liveItems: T[],
  overrides: { [key: string]: any }[],
  idField: string,
  getId: (item: T) => string,
): (T & { isHidden: boolean })[] {
  return liveItems.map((item) => {
    const override = overrides.find(
      (o) => o[idField]?.toString() === getId(item),
    );
    return { ...item, isHidden: override?.isHidden ?? false };
  });
}

export async function GET() {
  try {
    await connectDB();

    let settings = await GlobalNavItems.findOne({});
    if (!settings) settings = await GlobalNavItems.create({});

    const [solutionDoc, systemsDoc, industriesDoc] = await Promise.all([
      Solution.findOne({}).lean() as any,
      Systems.findOne({}).lean() as any,
      Industries.findOne({}).lean() as any,
    ]);

    const allSolutions = solutionDoc?.solutions || [];
    const allCategories = systemsDoc?.secondSection?.categories || [];
    const allIndustries = industriesDoc?.industries || [];

    // ── Header ────────────────────────────────────────────────────────────────

    const headerSolutions = allSolutions.map((sol: any) => {
      const override = settings.header.solutionOverrides.find(
        (o: any) => o.solutionId?.toString() === sol._id.toString(),
      );
      return {
        solutionId: sol._id,
        thumbnailTitle: sol.thumbnailTitle,
        slug: sol.slug,
        isHidden: override?.isHidden ?? false,
      };
    });

    const headerSystems = allCategories.map((cat: any) => {
      const catOverride = settings.header.systemOverrides.find(
        (o: any) => o.categoryId?.toString() === cat._id.toString(),
      );
      return {
        categoryId: cat._id,
        title: cat.title,
        isHidden: catOverride?.isHidden ?? false,
      };
    });

    const headerIndustries = allIndustries.map((ind: any) => {
      const override = settings.header.industryOverrides.find(
        (o: any) => o.industryId?.toString() === ind._id.toString(),
      );
      return {
        industryId: ind._id,
        thumbnailTitle: ind.thumbnailTitle,
        slug: ind.slug,
        isHidden: override?.isHidden ?? false,
      };
    });

    // ── Footer ────────────────────────────────────────────────────────────────

    const footerSolutions = allSolutions.map((sol: any) => {
      const override = settings.footer.solutionOverrides.find(
        (o: any) => o.solutionId?.toString() === sol._id.toString(),
      );
      return {
        solutionId: sol._id,
        thumbnailTitle: sol.thumbnailTitle,
        slug: sol.slug,
        isHidden: override?.isHidden ?? false,
      };
    });

    const footerSystems = allCategories.map((cat: any) => {
      const override = settings.footer.systemOverrides.find(
        (o: any) => o.categoryId?.toString() === cat._id.toString(),
      );
      return {
        categoryId: cat._id,
        title: cat.title,
        isHidden: override?.isHidden ?? false,
      };
    });

    return NextResponse.json({
      data: {
        contact: settings.contact,
        socials: settings.socials,
        header: {
          solutionsLabel: settings.header.solutionsLabel || "Solutions",
          systemsLabel: settings.header.systemsLabel || "Longevity Systems",
          industriesLabel:
            settings.header.industriesLabel || "Industries We Serve",
          menuItems: settings.header.menuItems,
          solutions: headerSolutions,
          systems: headerSystems,
          industries: headerIndustries,
        },
        footer: {
          solutionsLabel: settings.footer.solutionsLabel || "Solutions",
          systemsLabel: settings.footer.systemsLabel || "Longevity Systems",
          quickLinks: settings.footer.quickLinks,
          solutions: footerSolutions,
          systems: footerSystems,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    let settings = await GlobalNavItems.findOne({});
    if (!settings) settings = await GlobalNavItems.create({});

    // Auto-set social type from label
    if (body.socials) {
      body.socials = body.socials.map((s: any) => ({
        ...s,
        type: s.label?.toLowerCase() || "",
      }));
      settings.socials = body.socials;
    }

    if (body.contact) settings.contact = body.contact;

    if (body.header?.navLinks) settings.header.navLinks = body.header.navLinks;
    if (body.header?.solutionsLabel !== undefined)
      settings.header.solutionsLabel = body.header.solutionsLabel;
    if (body.header?.systemsLabel !== undefined)
      settings.header.systemsLabel = body.header.systemsLabel;
    if (body.header?.industriesLabel !== undefined)
      settings.header.industriesLabel = body.header.industriesLabel;
    if (body.footer?.quickLinks)
      settings.footer.quickLinks = body.footer.quickLinks;
    if (body.footer?.solutionsLabel !== undefined)
      settings.footer.solutionsLabel = body.footer.solutionsLabel;
    if (body.footer?.systemsLabel !== undefined)
      settings.footer.systemsLabel = body.footer.systemsLabel;

    // Save overrides from toggled isHidden values
    if (body.header?.solutions) {
      settings.header.solutionOverrides = body.header.solutions.map(
        (s: any) => ({
          solutionId: s.solutionId,
          isHidden: s.isHidden,
        }),
      );
    }

    if (body.header?.systems) {
      settings.header.systemOverrides = body.header.systems.map((c: any) => ({
        categoryId: c.categoryId,
        isHidden: c.isHidden,
      }));
    }

    if (body.header?.industries) {
      settings.header.industryOverrides = body.header.industries.map(
        (i: any) => ({
          industryId: i.industryId,
          isHidden: i.isHidden,
        }),
      );
    }

    if (body.footer?.solutions) {
      settings.footer.solutionOverrides = body.footer.solutions.map(
        (s: any) => ({
          solutionId: s.solutionId,
          isHidden: s.isHidden,
        }),
      );
    }

    if (body.footer?.systems) {
      settings.footer.systemOverrides = body.footer.systems.map((c: any) => ({
        categoryId: c.categoryId,
        isHidden: c.isHidden,
      }));
    }

    await settings.save();
    revalidateTag("global-nav-items", "default");

    return NextResponse.json({ message: "Settings saved successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
