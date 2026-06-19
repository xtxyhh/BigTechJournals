import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  {
    name: "Google",
    slug: "google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    description:
      "Google is one of the most sought-after employers in tech. Known for rigorous interviews spanning algorithms, system design, and Googleyness.",
    interviewProcess: {
      rounds: [
        { name: "Recruiter Screen", description: "Initial call to discuss background and role fit." },
        { name: "Phone Screen", description: "1-2 coding interviews on shared editor." },
        { name: "Onsite / Virtual Loop", description: "4-5 rounds: coding, system design, behavioral." },
        { name: "Hiring Committee", description: "Packet review and level calibration." },
        { name: "Team Matching", description: "Match with a team before offer." },
      ],
      tips: [
        "Practice medium/hard LeetCode with focus on patterns",
        "Prepare 2-3 system design stories",
        "Use STAR format for behavioral questions",
        "Research Google's leadership principles",
      ],
    },
    roadmap: {
      phases: [
        { period: "Month 1-2", focus: "DSA Foundations", tasks: ["Arrays, Strings, Hash Maps", "Two Pointers, Sliding Window", "50 Easy + 30 Medium problems"] },
        { period: "Month 3-4", focus: "Advanced DSA", tasks: ["Trees, Graphs, DP", "100 Medium problems", "Mock interviews weekly"] },
        { period: "Month 5-6", focus: "System Design + Behavioral", tasks: ["Design URL shortener, Twitter feed", "Prepare 5 STAR stories", "Googleyness prep"] },
      ],
    },
    resources: {
      books: ["Cracking the Coding Interview", "System Design Interview – Alex Xu"],
      youtube: ["NeetCode", "Tech Dummies Narendra L", "Exponent"],
      courses: ["Grokking the System Design Interview", "LeetCode Premium"],
      leetcode: ["Blind 75", "Google tagged questions"],
    },
    salaryInfo: {
      intern: { base: "$8,000/mo", total: "$9,500/mo" },
      swe1: { base: "$140,000", total: "$180,000" },
      swe2: { base: "$175,000", total: "$250,000" },
      senior: { base: "$220,000", total: "$350,000" },
    },
    faqs: [
      { q: "How long is the Google interview process?", a: "Typically 4-8 weeks from application to offer." },
      { q: "Do I need a CS degree?", a: "No, but strong DSA and problem-solving skills are essential." },
    ],
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    description:
      "Microsoft offers diverse roles across Azure, Office, Gaming, and AI. Interviews focus on coding, design, and collaboration.",
    interviewProcess: {
      rounds: [
        { name: "Recruiter Call", description: "Role overview and timeline." },
        { name: "Phone Interview", description: "1-2 technical coding rounds." },
        { name: "Virtual Onsite", description: "4 rounds: coding, system design, AA (As Appropriate)." },
      ],
      tips: ["Focus on clean code and communication", "Prepare Azure/system design basics", "Show growth mindset"],
    },
    roadmap: {
      phases: [
        { period: "Month 1-3", focus: "Core DSA", tasks: ["LeetCode grind", "Microsoft tagged questions"] },
        { period: "Month 4-6", focus: "Design + Behavioral", tasks: ["System design prep", "Leadership principles"] },
      ],
    },
    resources: {
      books: ["Elements of Programming Interviews"],
      youtube: ["NeetCode", "Microsoft Careers"],
      courses: ["LeetCode Premium"],
      leetcode: ["Microsoft tagged", "Blind 75"],
    },
    salaryInfo: {
      intern: { base: "$7,500/mo", total: "$9,000/mo" },
      swe1: { base: "$130,000", total: "$160,000" },
      swe2: { base: "$165,000", total: "$220,000" },
      senior: { base: "$200,000", total: "$300,000" },
    },
    faqs: [{ q: "Does Microsoft use LeetCode?", a: "Yes, coding rounds are similar to LeetCode medium/hard." }],
  },
  {
    name: "Amazon",
    slug: "amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    description:
      "Amazon interviews heavily emphasize Leadership Principles and bar-raiser rounds alongside technical skills.",
    interviewProcess: {
      rounds: [
        { name: "Online Assessment", description: "2 coding questions + work style survey." },
        { name: "Phone Screen", description: "Coding + LP questions." },
        { name: "Virtual Onsite", description: "4-5 rounds mixing coding, system design, and LP deep dives." },
      ],
      tips: ["Memorize all 16 Leadership Principles", "Use STAR format religiously", "Practice OOD for SDE2+"],
    },
    roadmap: {
      phases: [
        { period: "Month 1-2", focus: "LP + OA Prep", tasks: ["Write 16 STAR stories", "OA practice"] },
        { period: "Month 3-5", focus: "Technical", tasks: ["Amazon tagged LeetCode", "System design for SDE2"] },
      ],
    },
    resources: {
      books: ["Amazon Leadership Principles guide"],
      youtube: ["Dan Croitor", "Exponent"],
      courses: ["Grokking OOD"],
      leetcode: ["Amazon tagged"],
    },
    salaryInfo: {
      intern: { base: "$8,500/mo", total: "$10,000/mo" },
      swe1: { base: "$135,000", total: "$170,000" },
      swe2: { base: "$170,000", total: "$240,000" },
      senior: { base: "$210,000", total: "$320,000" },
    },
    faqs: [{ q: "What are Leadership Principles?", a: "Amazon's 16 core values used to evaluate every candidate." }],
  },
  {
    name: "Meta",
    slug: "meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    description: "Meta (Facebook) is known for fast-paced interviews with strong emphasis on coding speed and system design at senior levels.",
    interviewProcess: { rounds: [{ name: "Recruiter", description: "Initial screen" }, { name: "Technical Phone", description: "45-min coding" }, { name: "Onsite", description: "2 coding + 1 design + 1 behavioral" }], tips: ["Speed matters — practice timed sessions", "Know your past projects deeply"] },
    roadmap: { phases: [{ period: "Month 1-4", focus: "Speed coding", tasks: ["Meta tagged questions", "Timed mocks"] }] },
    resources: { books: ["CTCI"], youtube: ["NeetCode"], courses: ["LeetCode"], leetcode: ["Meta tagged"] },
    salaryInfo: { intern: { base: "$9,000/mo", total: "$11,000/mo" }, swe1: { base: "$150,000", total: "$190,000" }, swe2: { base: "$185,000", total: "$280,000" }, senior: { base: "$230,000", total: "$400,000" } },
    faqs: [],
  },
  {
    name: "Apple",
    slug: "apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    description: "Apple values craft, attention to detail, and domain expertise alongside strong fundamentals.",
    interviewProcess: { rounds: [{ name: "Phone Screen", description: "Technical + culture fit" }, { name: "Onsite", description: "Multiple technical rounds" }], tips: ["Show passion for products", "Deep dive into your domain"] },
    roadmap: { phases: [{ period: "Month 1-3", focus: "Fundamentals", tasks: ["Core CS", "Domain expertise"] }] },
    resources: { books: [], youtube: [], courses: [], leetcode: [] },
    salaryInfo: { intern: { base: "$7,000/mo", total: "$8,500/mo" }, swe1: { base: "$140,000", total: "$170,000" }, swe2: { base: "$175,000", total: "$250,000" }, senior: { base: "$220,000", total: "$350,000" } },
    faqs: [],
  },
  {
    name: "Netflix",
    slug: "netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    description: "Netflix hires senior engineers with strong system design and a culture of freedom and responsibility.",
    interviewProcess: { rounds: [{ name: "Recruiter", description: "Culture discussion" }, { name: "Technical", description: "Deep system design focus" }], tips: ["Senior-level design expected", "Know distributed systems"] },
    roadmap: { phases: [] },
    resources: { books: ["Designing Data-Intensive Applications"], youtube: [], courses: [], leetcode: [] },
    salaryInfo: { intern: { base: "N/A", total: "N/A" }, swe1: { base: "$200,000", total: "$400,000" }, swe2: { base: "$250,000", total: "$500,000" }, senior: { base: "$350,000", total: "$700,000" } },
    faqs: [],
  },
  {
    name: "Adobe",
    slug: "adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg",
    description: "Adobe combines creative technology with solid engineering practices. Interviews focus on DSA and project experience.",
    interviewProcess: { rounds: [{ name: "OA", description: "Online assessment" }, { name: "Technical Rounds", description: "2-3 coding rounds" }], tips: ["Good work-life balance culture", "Prepare project stories"] },
    roadmap: { phases: [] },
    resources: { books: [], youtube: [], courses: [], leetcode: ["Adobe tagged"] },
    salaryInfo: { intern: { base: "$7,000/mo", total: "$8,000/mo" }, swe1: { base: "$120,000", total: "$150,000" }, swe2: { base: "$155,000", total: "$200,000" }, senior: { base: "$190,000", total: "$280,000" } },
    faqs: [],
  },
  {
    name: "Uber",
    slug: "uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    description: "Uber interviews test coding, system design, and practical engineering judgment.",
    interviewProcess: { rounds: [{ name: "Phone", description: "Coding screen" }, { name: "Onsite", description: "Coding + design + behavioral" }], tips: ["System design is critical for senior roles"] },
    roadmap: { phases: [] },
    resources: { books: [], youtube: [], courses: [], leetcode: ["Uber tagged"] },
    salaryInfo: { intern: { base: "$8,000/mo", total: "$9,500/mo" }, swe1: { base: "$140,000", total: "$180,000" }, swe2: { base: "$175,000", total: "$260,000" }, senior: { base: "$220,000", total: "$380,000" } },
    faqs: [],
  },
  {
    name: "Atlassian",
    slug: "atlassian",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Atlassian-logo.svg",
    description: "Atlassian values teamwork, open work culture, and strong technical fundamentals.",
    interviewProcess: { rounds: [{ name: "Values Interview", description: "Culture and values" }, { name: "Technical", description: "Coding rounds" }], tips: ["Research Atlassian values", "Show collaboration examples"] },
    roadmap: { phases: [] },
    resources: { books: [], youtube: [], courses: [], leetcode: [] },
    salaryInfo: { intern: { base: "$6,500/mo", total: "$7,500/mo" }, swe1: { base: "$115,000", total: "$145,000" }, swe2: { base: "$150,000", total: "$195,000" }, senior: { base: "$185,000", total: "$260,000" } },
    faqs: [],
  },
  {
    name: "Walmart",
    slug: "walmart",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg",
    description: "Walmart Global Tech offers competitive packages with focus on scale and e-commerce engineering.",
    interviewProcess: { rounds: [{ name: "OA", description: "HackerRank assessment" }, { name: "Technical", description: "2-3 rounds" }], tips: ["Scale and retail domain knowledge helps"] },
    roadmap: { phases: [] },
    resources: { books: [], youtube: [], courses: [], leetcode: [] },
    salaryInfo: { intern: { base: "$6,000/mo", total: "$7,000/mo" }, swe1: { base: "$110,000", total: "$140,000" }, swe2: { base: "$140,000", total: "$180,000" }, senior: { base: "$170,000", total: "$240,000" } },
    faqs: [],
  },
  {
    name: "OpenAI",
    slug: "openai",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    description: "OpenAI seeks exceptional engineers passionate about AI safety and cutting-edge ML systems.",
    interviewProcess: { rounds: [{ name: "Recruiter", description: "Mission alignment" }, { name: "Technical", description: "Coding + ML/system design" }], tips: ["Show ML projects", "Demonstrate research curiosity"] },
    roadmap: { phases: [] },
    resources: { books: [], youtube: [], courses: [], leetcode: [] },
    salaryInfo: { intern: { base: "$10,000/mo", total: "$12,000/mo" }, swe1: { base: "$200,000", total: "$350,000" }, swe2: { base: "$250,000", total: "$450,000" }, senior: { base: "$300,000", total: "$600,000" } },
    faqs: [],
  },
];

const categories = [
  { name: "Internships", slug: "internships", description: "Stories from students who secured internships at Big Tech.", icon: "🎓", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Interview Prep", slug: "interview-prep", description: "Preparation strategies and interview experiences.", icon: "💼", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop" },
  { name: "Career Switch", slug: "career-switch", description: "Journeys from non-tech or service roles into product companies.", icon: "🔄", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" },
  { name: "DSA", slug: "dsa", description: "Data structures and algorithms mastery stories.", icon: "🧮", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop" },
  { name: "Startups", slug: "startups", description: "Startup culture, equity, and growth stories.", icon: "🚀", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Big Tech", slug: "big-tech", description: "Stories from engineers at FAANG and top product companies.", icon: "🏢", image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Growth After Joining", slug: "growth", description: "Promotions, salary negotiations, and career growth.", icon: "📈", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "AI & ML", slug: "ai-ml", description: "Machine learning and AI career paths.", icon: "🤖", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

async function main() {
  console.log("Seeding database...");

  for (const company of companies) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      create: company,
      update: company,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: category,
    });
  }

  const google = await prisma.company.findUnique({ where: { slug: "google" } });
  const amazon = await prisma.company.findUnique({ where: { slug: "amazon" } });
  const meta = await prisma.company.findUnique({ where: { slug: "meta" } });
  const uber = await prisma.company.findUnique({ where: { slug: "uber" } });
  const microsoft = await prisma.company.findUnique({ where: { slug: "microsoft" } });

  const catInternships = await prisma.category.findUnique({ where: { slug: "internships" } });
  const catInterview = await prisma.category.findUnique({ where: { slug: "interview-prep" } });
  const catCareerSwitch = await prisma.category.findUnique({ where: { slug: "career-switch" } });
  const catDsa = await prisma.category.findUnique({ where: { slug: "dsa" } });
  const catBigTech = await prisma.category.findUnique({ where: { slug: "big-tech" } });
  const catGrowth = await prisma.category.findUnique({ where: { slug: "growth" } });

  const stories = [
    {
      title: "I failed 8 interviews before cracking Amazon",
      slug: "failed-8-interviews-amazon",
      excerpt: "The rejection emails were piling up. My confidence was at an all-time low. Here is exactly what I changed in my preparation strategy to finally get the offer.",
      content: `## The Beginning\n\nWhen I started my job search, I thought I was ready. I had solved 100 LeetCode problems and read CTCI cover to cover. But reality hit hard — 8 rejections in 4 months.\n\n## What Changed\n\n### 1. Pattern-Based Learning\nInstead of random problem solving, I focused on 15 core patterns. This changed everything.\n\n### 2. Mock Interviews\nI did 2 mock interviews per week on Pramp and Interviewing.io.\n\n### 3. Leadership Principles\nAmazon's LP questions were my weakness. I wrote STAR stories for all 16 principles.\n\n## The Offer\n\nOn my 9th attempt, everything clicked. The OA felt familiar, the phone screen went smoothly, and the onsite — while tough — was manageable because I had seen similar problems.\n\n**Key takeaway:** Failure is data. Each rejection taught me something new.`,
      coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
      companyId: amazon!.id,
      authorName: "Rahul Sharma",
      authorRole: "SDE I at Amazon",
      published: true,
      featured: true,
      views: 12500,
      readTime: 6,
      outcomeType: "positive",
      outcomeText: "Offer Received",
      careerStage: "Student",
      categoryIds: [catInterview!.id, catBigTech!.id],
    },
    {
      title: "From Service-Based to Product-Based: My 6-Month Roadmap",
      slug: "service-to-product-roadmap",
      excerpt: "Switching from a service company to a product giant seemed impossible. I had to unlearn legacy coding practices and master system design.",
      content: `## My Background\n\n3 years at TCS, working on maintenance projects. Zero system design experience.\n\n## The 6-Month Plan\n\n**Month 1-2:** DSA daily — 2 problems minimum\n**Month 3-4:** System design basics — Alex Xu book\n**Month 5-6:** Mock interviews + referrals\n\n## Result\n\nLanded SDE II at Amazon with a 3x salary increase.`,
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
      companyId: amazon!.id,
      authorName: "Maria Rosand",
      authorRole: "SDE II at Amazon",
      published: true,
      featured: true,
      views: 8200,
      readTime: 8,
      outcomeType: "positive",
      outcomeText: "Transition Successful",
      careerStage: "Full-time",
      categoryIds: [catCareerSwitch!.id],
    },
    {
      title: "My Internship at Google: Expectation vs Reality",
      slug: "google-internship-expectation-reality",
      excerpt: "I thought I would be writing code all day. Instead, I spent 40% of my time reading docs and attending meetings.",
      content: `## Expectation\n\nCoding 8 hours a day on exciting projects.\n\n## Reality\n\n- 40% reading documentation\n- 30% meetings and standups\n- 30% actual coding\n\n## How I Got the PPO\n\nI focused on impact over lines of code. I shipped one meaningful feature and documented everything.`,
      coverImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop",
      companyId: google!.id,
      authorName: "Priya Patel",
      authorRole: "SWE Intern at Google",
      published: true,
      featured: true,
      views: 15000,
      readTime: 5,
      outcomeType: "positive",
      outcomeText: "PPO Secured",
      careerStage: "Intern",
      categoryIds: [catInternships!.id, catBigTech!.id],
    },
    {
      title: "Google L4 Interview: The Hidden Rubric",
      slug: "google-l4-interview-rubric",
      excerpt: "After talking to 5 Google L5+ engineers, I discovered the hidden rubric they use to evaluate L4 candidates.",
      content: `## The Hidden Rubric\n\nGoogle evaluates on 4 axes:\n1. **Coding** — Can you solve medium/hard in 35 min?\n2. **System Design** — Can you design a scalable system?\n3. **Googleyness** — Collaboration, ambiguity tolerance\n4. **Leadership** — Even L4 needs to show initiative\n\n## My Preparation\n\n200 LeetCode problems, 10 system design mocks, 15 STAR stories.`,
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      companyId: google!.id,
      authorName: "Sarah Jenkins",
      authorRole: "Staff Engineer at Google",
      linkedin: "https://linkedin.com/in/sarahjenkins",
      published: true,
      featured: false,
      views: 22000,
      readTime: 7,
      outcomeType: "positive",
      outcomeText: "L4 Offer",
      careerStage: "Full-time",
      categoryIds: [catInterview!.id, catBigTech!.id],
    },
    {
      title: "Amazon Leadership Principles in Action",
      slug: "amazon-leadership-principles-action",
      excerpt: "How I used Customer Obsession and Dive Deep to turn a failing project into my strongest interview story.",
      content: `## The Story\n\nDuring my internship, our team's project was 2 weeks behind schedule.\n\n## LP Applied\n\n**Customer Obsession:** I talked to 5 users to understand real pain points.\n**Dive Deep:** Found the root cause in our caching layer.\n**Deliver Results:** Shipped 3 days early after the fix.\n\nThis single story helped me in 3 LP rounds.`,
      coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      companyId: amazon!.id,
      authorName: "Alex Chen",
      authorRole: "Senior PM at Amazon",
      published: true,
      views: 18500,
      readTime: 5,
      categoryIds: [catInterview!.id],
    },
    {
      title: "Why I left my $300k Meta job",
      slug: "why-i-left-meta",
      excerpt: "The money was great, but something was missing. Here is my honest story about choosing fulfillment over compensation.",
      content: `## The Golden Handcuffs\n\n$300k TC at Meta. RSUs vesting. On paper, perfect.\n\n## What Was Missing\n\n- No ownership of meaningful projects\n- Constant reorgs\n- Burnout from on-call rotations\n\n## What's Next\n\nI joined a Series B startup as founding engineer. TC is lower but impact is 10x.`,
      coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      companyId: meta!.id,
      authorName: "Mike Ross",
      authorRole: "Ex-Meta Engineer",
      published: true,
      views: 31000,
      readTime: 6,
      outcomeType: "neutral",
      outcomeText: "Resigned",
      careerStage: "Full-time",
      categoryIds: [catBigTech!.id, catGrowth!.id],
    },
    {
      title: "Mastering Dynamic Programming: The Pattern That Clicked",
      slug: "mastering-dp-pattern",
      excerpt: "DP was my nemesis. Then I found the State-Transition framework.",
      content: `## The Framework\n\nEvery DP problem has:\n1. **States** — What are you tracking?\n2. **Transitions** — How do states change?\n3. **Base cases** — Where do you start?\n\n## Practice Plan\n\nWeek 1: 1D DP\nWeek 2: 2D DP\nWeek 3: Interval DP\nWeek 4: Tree DP`,
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop",
      authorName: "Ankit Verma",
      authorRole: "SDE at Microsoft",
      companyId: microsoft!.id,
      published: true,
      views: 22000,
      readTime: 10,
      outcomeType: "positive",
      outcomeText: "Concept Mastered",
      careerStage: "Student",
      categoryIds: [catDsa!.id],
    },
    {
      title: "System Design mistakes that cost me the Uber offer",
      slug: "system-design-mistakes-uber",
      excerpt: "I focused too much on scaling and forgot basic API design.",
      content: `## Mistake 1: Jumping to Microservices\n\nStarted with 10 services when a monolith would suffice.\n\n## Mistake 2: Ignoring API Design\n\nSpent 30 min on scaling, 2 min on REST endpoints.\n\n## Mistake 3: No Trade-off Discussion\n\nDidn't mention CAP theorem or consistency choices.\n\n## Lesson\n\nStart simple, then scale. Always discuss trade-offs.`,
      coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      companyId: uber!.id,
      authorName: "Daniel Hamilton",
      authorRole: "Staff Engineer",
      published: true,
      views: 9500,
      readTime: 6,
      categoryIds: [catInterview!.id],
    },
    {
      title: "How I cracked Morgan Stanley Internship in 1st Year",
      slug: "morgan-stanley-internship-first-year",
      excerpt: "I didn't come from a top school. Here is the exact roadmap, resources, and mistakes I avoided.",
      content: `## Background\n\nTier 3 college, first year CS student.\n\n## Roadmap\n\n- **Month 1-3:** C++ and DSA basics\n- **Month 4-6:** 50 LeetCode problems\n- **Month 7-9:** Projects + resume\n- **Month 10-12:** Applications + interviews\n\n## Result\n\nMorgan Stanley SDE Intern offer in first year.`,
      coverImage: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      authorName: "Yagna Kusumanchi",
      authorRole: "SDE Intern",
      published: true,
      featured: true,
      views: 18000,
      readTime: 10,
      outcomeType: "positive",
      outcomeText: "Offer Received",
      careerStage: "Intern",
      categoryIds: [catInternships!.id],
    },
    {
      title: "Negotiating My Salary: How I Increased My Offer by 40%",
      slug: "salary-negotiation-40-percent",
      excerpt: "I was terrified to ask for more. But with market research and a script, I got a significant bump.",
      content: `## The Script\n\n"I am excited about the offer. Based on my research and competing offers, I was hoping for X. Is there flexibility?"\n\n## What Worked\n\n- Having a competing offer\n- Being specific about numbers\n- Showing enthusiasm for the role\n\n## Result\n\n40% increase from initial offer.`,
      coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
      authorName: "Stephanie W.",
      authorRole: "Senior SWE",
      published: true,
      views: 18000,
      readTime: 4,
      outcomeType: "positive",
      outcomeText: "Salary Hiked",
      careerStage: "Full-time",
      categoryIds: [catGrowth!.id],
    },
  ];

  for (const { categoryIds, ...storyData } of stories) {
    const story = await prisma.story.upsert({
      where: { slug: storyData.slug },
      create: storyData,
      update: storyData,
    });

    if (categoryIds) {
      for (const categoryId of categoryIds) {
        await prisma.storyCategory.upsert({
          where: { storyId_categoryId: { storyId: story.id, categoryId } },
          create: { storyId: story.id, categoryId },
          update: {},
        });
      }
    }
  }

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
