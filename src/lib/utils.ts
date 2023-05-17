import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//change the homepage 
export const topics = [
  {
    name: "Math",
    children: [
      { name: "Algebra", emoji: "➕" },
      { name: "Geometry", emoji: "🔺" },
      { name: "Trigonometry", emoji: "📐" },
      { name: "Calculus", emoji: "📈" },
    ],
  },
  {
    name: "History",
    children: [
      {
        name: "Ancient",
        emoji: "🏛️",
      },
      {
        name: "European",
        emoji: "🏰",
      },
      {
        name: "American",
        emoji: "🗽",
      },
      {
        name: "Asian",
        emoji: "🏯",
      },
      {
        name: "African",
        emoji: "🌍",
      },
    ],
  },
  {
    name: "Science",
    children: [
      {
        name: "Chemistry",
        emoji: "⚗️",
      },
      {
        name: "Biology",
        emoji: "🧬",
      },
      {
        name: "Physics",
        emoji: "🌌",
      },
    ],
  },
];
