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
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Learn From People Who Cracked Big Tech",
  description:
    "Stories. Interview Experiences. Preparation Guides. Resources. Everything in one place to help students and professionals crack Big Tech.",
  path: "/",
});

export const revalidate = 3600;

async function getHomeData() {
  try {
    const [featuredRaw, trending, latest, companies, categories] = await Promise.all([
      getFeaturedStories(5),
      getTrendingStories(3),
      getLatestStories(4),
      getAllCompanies(),
      getAllCategories(),
    ]);

    const spotlight = latest[0]
      ? {
          title: latest[0].title,
          author: latest[0].authorName,
          role: latest[0].authorRole ?? "Engineer",
          slug: latest[0].slug,
          coverImage:
            latest[0].coverImage ??
            "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
        }
      : null;

    const featured = featuredRaw.map((s, i) => ({
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
      image: c.image ?? "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

    return { spotlight, featured, trending, latest: latestMapped, companies, categoryItems };
  } catch {
    return {
      spotlight: null,
      featured: [],
      trending: [],
      latest: [],
      companies: [],
      categoryItems: [],
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-0">
        <Hero spotlight={data.spotlight} />
        <LogoCloud companies={data.companies} />
        <Categories categories={data.categoryItems.length ? data.categoryItems : undefined} />
        <Trending stories={data.trending.length ? data.trending : undefined} />
        <LatestArticles stories={data.latest} />
        <Featured posts={data.featured} />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
