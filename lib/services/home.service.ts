import connectDB from "@/lib/mongodb";
import HomeModel from "@/app/models/Home";
import SystemsModel from "@/app/models/Systems";
import IndustriesModel from "@/app/models/industries";
import { unstable_cache } from "next/cache";

export const getHome = unstable_cache(
  async () => {
    await connectDB();

    const [home, systems, industriesDoc] = await Promise.all([
      HomeModel.findOne({}).lean(),
      SystemsModel.findOne({}).lean(),
      IndustriesModel.findOne({}).lean(),
    ]);

    if (!home) throw new Error("Home not found");

    const categories =
      (systems as any)?.secondSection?.categories?.map((cat: any) => ({
        _id: String(cat._id),
        title: cat.title,
        products: cat.products.map((p: any) => ({
          _id: String(p._id),
          thumbnailTitle: p.thumbnailTitle,
          slug: p.slug,
          thumbnailImage: p.thumbnailImage,
          thumbnailImageAlt: p.thumbnailImageAlt,
        })),
      })) ?? [];

    const industries =
      (industriesDoc as any)?.industries
        ?.filter((i: any) => !i.isHidden)
        ?.map((i: any) => ({
          _id: String(i._id),
          homeAnimatedIcon: i.homeAnimatedIcon,
          homeAnimatedIconAlt: i.homeAnimatedIconAlt,
          thumbnailTitle: i.thumbnailTitle,
          slug: i.slug,
          homeAnimatedMobIcon: i.homeAnimatedMobIcon,
          homeAnimatedMobIconAlt: i.homeAnimatedMobIconAlt,
        })) ?? [];

    return JSON.parse(JSON.stringify({ home, categories, industries }));
  },
  ["Home"],
  { tags: ["Home"] },
);