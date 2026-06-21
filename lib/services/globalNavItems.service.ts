import connectDB from "@/lib/mongodb";
import GlobalNavItems from "@/app/models/GlobalNavItems";
import Solution from "@/app/models/Solution";
import Systems from "@/app/models/Systems";
import Industries from "@/app/models/industries";
import { unstable_cache } from "next/cache";

export const getGlobalNavItems = unstable_cache(
  async () => {
    await connectDB();

    const [settings, solutionDoc, systemsDoc, industriesDoc] =
      await Promise.all([
        GlobalNavItems.findOne({}).lean() as any,
        Solution.findOne({}).lean() as any,
        Systems.findOne({}).lean() as any,
        Industries.findOne({}).lean() as any,
      ]);

    const allSolutions = solutionDoc?.solutions || [];
    const allCategories = systemsDoc?.secondSection?.categories || [];
    const allIndustries = industriesDoc?.industries || [];

    const solutionOverrides = settings?.header?.solutionOverrides || [];
    const systemOverrides = settings?.header?.systemOverrides || [];
    const industryOverrides = settings?.header?.industryOverrides || [];
    const footerSolutionOverrides = settings?.footer?.solutionOverrides || [];
    const footerSystemOverrides = settings?.footer?.systemOverrides || [];

    const headerSolutions = allSolutions
      .map((sol: any) => {
        const override = solutionOverrides.find(
          (o: any) => o.solutionId?.toString() === sol._id.toString(),
        );
        return {
          solutionId: sol._id,
          thumbnailTitle: sol.thumbnailTitle,
          slug: sol.slug,
          isHidden: override?.isHidden ?? false,
        };
      })
      .filter((s: any) => !s.isHidden);

    const headerSystems = allCategories
      .map((cat: any) => {
        const catOverride = systemOverrides.find(
          (o: any) => o.categoryId?.toString() === cat._id.toString(),
        );
        const products = (cat.products || [])
          .map((prod: any) => {
            const prodOverride = catOverride?.productOverrides?.find(
              (p: any) => p.productId?.toString() === prod._id.toString(),
            );
            return {
              productId: prod._id,
              thumbnailTitle: prod.thumbnailTitle,
              slug: prod.slug,
              isHidden: prodOverride?.isHidden ?? false,
            };
          })
          .filter((p: any) => !p.isHidden);
        return {
          categoryId: cat._id,
          title: cat.title,
          isHidden: catOverride?.isHidden ?? false,
          products,
        };
      })
      .filter((c: any) => !c.isHidden);

    const headerIndustries = allIndustries
      .map((ind: any) => {
        const override = industryOverrides.find(
          (o: any) => o.industryId?.toString() === ind._id.toString(),
        );
        return {
          industryId: ind._id,
          thumbnailTitle: ind.thumbnailTitle,
          slug: ind.slug,
          isHidden: override?.isHidden ?? false,
        };
      })
      .filter((i: any) => !i.isHidden);

    const footerSolutions = allSolutions
      .map((sol: any) => {
        const override = footerSolutionOverrides.find(
          (o: any) => o.solutionId?.toString() === sol._id.toString(),
        );
        return {
          solutionId: sol._id,
          thumbnailTitle: sol.thumbnailTitle,
          slug: sol.slug,
          isHidden: override?.isHidden ?? false,
        };
      })
      .filter((s: any) => !s.isHidden);

    const footerSystems = allCategories
      .map((cat: any) => {
        const override = footerSystemOverrides.find(
          (o: any) => o.categoryId?.toString() === cat._id.toString(),
        );
        return {
          categoryId: cat._id,
          title: cat.title,
          isHidden: override?.isHidden ?? false,
        };
      })
      .filter((c: any) => !c.isHidden);

    return JSON.parse(
      JSON.stringify({
        contact: settings?.contact || {},
        socials: (settings?.socials || []).filter((s: any) => !s.isHidden),
header: {
  solutionsLabel: settings?.header?.solutionsLabel || "Solutions",
  systemsLabel: settings?.header?.systemsLabel || "Longevity Systems",
  industriesLabel: settings?.header?.industriesLabel || "Industries We Serve",
  menuItems: (settings?.header?.menuItems || []).filter(
    (m: any) => !m.isHidden,
  ),
  solutions: headerSolutions,
  systems: headerSystems,
  industries: headerIndustries,
},
        footer: {
          quickLinks: (settings?.footer?.quickLinks || []).filter(
            (q: any) => !q.isHidden,
          ),
          solutions: footerSolutions,
          systems: footerSystems,
        },
      }),
    );
  },
  ["global-nav-items"],
  { tags: ["global-nav-items"] },
);
