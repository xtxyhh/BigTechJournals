import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoCloud from "@/components/LogoCloud";
import Categories from "@/components/Categories";
import Trending from "@/components/Trending";
import LatestArticles from "@/components/LatestArticles";
import Featured from "@/components/Featured";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getFeaturedStories, getTrendingStories, getLatestStories } from "@/lib/stories";
import { getAllCompanies, getAllCategories } from "@/lib/companies";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    const settings = await getSiteSettings();
    return buildMetadata({
      title: settings.seoDefaultTitle.replace(" | BigTechJournals", "").replace("BigTechJournals — ", ""),
      description: settings.seoDefaultDescription,
      path: "/",
    });
  } catch {
    return buildMetadata({
      title: "Learn From People Who Cracked Big Tech",
      description: "Stories. Interview Experiences. Preparation Guides. Resources.",
      path: "/",
    });
  }
}

export const revalidate = 3600;

async function getHomeData() {
  try {
    const [featuredRaw, trending, latest, companies, categories, settings] = await Promise.all([
      getFeaturedStories(5),
      getTrendingStories(3),
      getLatestStories(4),
      getAllCompanies(),
      getAllCategories(),
      getSiteSettings(),
    ]);

    const spotlight = latest[0]
      ? {
          title: latest[0].title,
          author: latest[0].authorName,
          role: latest[0].authorRole ?? "Engineer",
          slug: latest[0].slug,
          coverImage: safeImageUrl(latest[0].coverImage, DEFAULT_IMAGES.storyCover),
        }
      : null;

    const featured = featuredRaw.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.id,
      category: s.category,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      readTime: parseInt(s.readTime.split(" ")[0]) || 5,
      image: s.image,
    }));

    const categoryItems = categories.slice(0, 5).map((c) => ({
      label: c.name,
      slug: c.slug,
      image: safeImageUrl(c.image, DEFAULT_IMAGES.categoryTech),
      count: `${c._count.stories}+ Stories`,
    }));

    const latestMapped = latest.map((s) => ({
      title: s.title,
      slug: s.slug,
      excerpt: s.excerpt,
      authorName: s.authorName,
      authorRole: s.authorRole,
      company: s.company,
      readTime: s.readTime,
      createdAt: s.createdAt,
      category: s.categories[0]?.category.name ?? "General",
      coverImage: s.coverImage,
    }));

    return { spotlight, featured, trending, latest: latestMapped, companies, categoryItems, settings };
  } catch {
    return {
      spotlight: null,
      featured: [],
      trending: [],
      latest: [],
      companies: [],
      categoryItems: [],
      settings: null,
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-surface">
      {data.settings?.announcementEnabled && data.settings.announcementText && (
        <div className="bg-blue-600/90 text-white text-center text-sm py-2 px-4">
          {data.settings.announcementText}
        </div>
      )}
      <Navbar />
      <div className="pt-0">
        <Hero
          spotlight={data.spotlight}
          subtitle={data.settings?.heroSubtitle}
        />
        <LogoCloud companies={data.companies} />
        <Categories categories={data.categoryItems.length ? data.categoryItems : undefined} />
        <Trending stories={data.trending.length ? data.trending : undefined} />
        <LatestArticles stories={data.latest} />
        <Featured posts={data.featured} />
        <Testimonials />
        <FAQ />
        <Newsletter
          title={data.settings?.newsletterTitle}
          description={data.settings?.newsletterDescription}
        />
        <Footer settings={data.settings ?? undefined} />
      </div>
    </main>
  );
}
