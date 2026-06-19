"use client";
import { Heart } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";
import Link from "next/link";

interface JournalCardProps {
  title: string;
  slug?: string;
  preview: string;
  role?: string;
  company?: string;
  image?: string;
  readTime?: string;
  author?: string;
  date?: string;
  category?: string;
}

export default function JournalCard({
  title,
  slug,
  preview,
  image,
  author = "Anonymous",
  date = "July 1, 2024",
  category = "Career",
}: JournalCardProps) {
  const content = (
    <CardContainer className="inter-var w-full h-full py-2 md:py-4">
      <CardBody className="bg-white relative group/card border-gray-100 w-full h-auto rounded-xl p-4 border  hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
        <CardItem translateZ="50" className="w-full mt-2">
          <div className="h-48 rounded-xl bg-slate-100 relative overflow-hidden w-full">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover/card:shadow-xl w-full h-full rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200" />
            )}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm z-10">
              {category}
            </div>
          </div>
        </CardItem>

        <CardItem
          translateZ="60"
          className="text-lg font-bold text-slate-900 mt-6 leading-tight group-hover:text-brand-blue transition-colors"
        >
          {title}
        </CardItem>

        <CardItem
          as="p"
          translateZ="40"
          className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed mb-6 line-clamp-2"
        >
          {preview}
        </CardItem>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-dashed border-gray-100 w-full">
          <CardItem
            translateZ={20}
            className="flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            <span className="text-slate-900">By {author}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>{date}</span>
          </CardItem>

          <CardItem translateZ={20} className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-rose-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );

  if (slug) {
    return <Link href={`/stories/${slug}`}>{content}</Link>;
  }
  return content;
}
