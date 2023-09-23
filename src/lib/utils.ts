import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Topics, ReportStatus } from "@prisma/client";

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
    name: "sidebar.math",
    children: [
      { name: "Math I", emoji: "🔢", topic: Topics.MATH_I },
      { name: "Math II", emoji: "📈", topic: Topics.MATH_II },
    ],
  },
  {
    name: "sidebar.history",
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
    name: "sidebar.science",
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

export const statusToColor = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.OPEN:
      return "text-red-500";
    case ReportStatus.CLOSED:
      return "text-green-500";
    case ReportStatus.IN_PROGRESS:
      return "text-yellow-500";
    default:
      return "text-red-500";
  }
};

export type Languages =
  | "ar"
  | "cn"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "it"
  | "ja"
  | "ko"
  | "pt"
  | "ru";
