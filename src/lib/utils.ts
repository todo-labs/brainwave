import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Topics } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TopicList = {
  name: string;
  children: {
    name: string;
    emoji: string;
    topic: Topics;
  }[];
};

//change the homepage
export const topics: TopicList[] = [
  {
    name: "Math",
    children: [
      { name: "Algebra", emoji: "➕", topic: Topics.ALGEBRA },
      { name: "Geometry", emoji: "🔺", topic: Topics.GEOMETRY },
      { name: "Trigonometry", emoji: "📐", topic: Topics.TRIGONOMETRY },
      { name: "Calculus", emoji: "📈", topic: Topics.CALCULUS },
    ],
  },
  {
    name: "History",
    children: [
      {
        name: "Ancient",
        emoji: "🏛️",
        topic: Topics.ANCIENT_HISTORY,
      },
      {
        name: "European",
        emoji: "🏰",
        topic: Topics.EUROPEAN_HISTORY,
      },
      {
        name: "American",
        emoji: "🗽",
        topic: Topics.AMERICAN_HISTORY,
      },
      {
        name: "Asian",
        emoji: "🏯",
        topic: Topics.ASIAN_HISTORY,
      },
      {
        name: "African",
        emoji: "🌍",
        topic: Topics.AFRICAN_HISTORY,
      },
    ],
  },
  {
    name: "Science",
    children: [
      {
        name: "Chemistry",
        emoji: "⚗️",
        topic: Topics.CHEMISTRY,
      },
      {
        name: "Biology",
        emoji: "🧬",
        topic: Topics.BIOLOGY,
      },
      {
        name: "Physics",
        emoji: "🌌",
        topic: Topics.PHYSICS,
      },
    ],
  },
];
