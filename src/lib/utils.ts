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

export const topics: TopicList[] = [
  {
    name: "Math",
    children: [
      { name: "Math I", emoji: "🔢", topic: Topics.MATH_I },
      { name: "Math II", emoji: "📈", topic: Topics.MATH_II },
    ],
  },
  {
    name: "History",
    children: [
      {
        name: "World History",
        emoji: "🌍",
        topic: Topics.WORLD_HISTORY,
      },
      {
        name: "American History",
        emoji: "🗽",
        topic: Topics.US_HISTORY,
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
        name: "Biology E",
        emoji: "🧬",
        topic: Topics.BIOLOGY_E,
      },
      {
        name: "Biology M",
        emoji: "🔬",
        topic: Topics.BIOLOGY_M,
      },
      {
        name: "Physics",
        emoji: "⚛️",
        topic: Topics.PHYSICS,
      },
    ],
  },
];

export const cleanEnum = (str: string) => {
  return str.replace(/_/g, " ");
};