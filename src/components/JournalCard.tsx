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
  const card = (
    <CardContainer className="inter-var w-full h-full py-2 md:py-4">
      <CardBody className="bg-surface-card relative group/card border-surface-border w-full h-full min-h-[420px] rounded-xl p-4 border hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.01] transition-all duration-200">
        <CardItem translateZ="50" className="w-full mt-2">
          <div className="h-48 rounded-xl bg-surface-elevated relative overflow-hidden w-full">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover/card:shadow-xl w-full h-full rounded-xl transition-transform duration-300 group-hover/card:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-elevated to-surface-muted" />
            )}
            <div className="absolute top-3 left-3 bg-surface-card/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm z-10">
              {category}
            </div>
          </div>
        </CardItem>

        <CardItem
          translateZ="60"
          className="text-lg font-bold text-white mt-6 leading-tight group-hover:text-brand-blue transition-colors duration-200"
        >
          {title}
        </CardItem>

        <CardItem
          as="p"
          translateZ="40"
          className="text-surface-muted text-sm max-w-sm mt-3 leading-relaxed mb-6 line-clamp-2"
        >
          {preview}
        </CardItem>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-dashed border-surface-border w-full">
          <CardItem
            translateZ={20}
            className="flex items-center gap-2 text-xs font-medium text-surface-muted"
          >
            <span className="text-white">By {author}</span>
            <span className="w-1 h-1 bg-surface-muted rounded-full" />
            <span>{date}</span>
          </CardItem>

          <CardItem translateZ={20} className="flex items-center gap-2">
            <span
              className="text-surface-muted group-hover/card:text-rose-400 transition-colors duration-200"
              aria-hidden="true"
            >
              <Heart className="w-4 h-4" />
            </span>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );

  if (slug) {
    return (
      <Link href={`/stories/${slug}`} className="block h-full">
        {card}
      </Link>
    );
  }
  return card;
}
