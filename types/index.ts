import type common from "../public/locales/en/common.json";
import type { Questions, Quiz } from "@prisma/client";

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeys = RecursiveKeyOf<typeof common>;

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string
> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text;

export type QuizWithQuestions = Quiz & {
  questions: Questions[] | null;
};

export type Tabs = "choice" | "config" | "exam" | "result";

export const languages = [
  "ar",
  "cn",
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "ko",
  "pt",
  "ru",
  "hi",
  "yo",
] as const;

export type Languages = (typeof languages)[number];
