import React from "react";
import { useTranslation } from "next-i18next";
import { type TxKeys } from "types";
import { cn } from "@/lib/utils";

export type Levels = "h1" | "h2" | "h3" | "h4" | "h5";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  level?: Levels;
  className?: string;
  tx?: TxKeys;
  txOptions?: Record<string, unknown>;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level,
  className,
  tx,
  txOptions,
  ...props
}) => {
  const { t } = useTranslation("common");
  const baseStyle = "text-base";
  const headingStyles = {
    h1: "text-4xl",
    h2: "text-3xl",
    h3: "text-2xl",
    h4: "text-xl",
    h5: "text-lg",
  };

  const headingStyle = cn(
    baseStyle,
    level ? headingStyles[level] : "h1",
    className
  );

  const Tag = level ? level : "h1";
  const headingText = tx ? t(tx, { ...txOptions }) : children;

  return (
    <Tag className={headingStyle} {...props}>
      {headingText}
    </Tag>
  );
};

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
  tx?: TxKeys;
  txOptions?: Record<string, unknown>;
}

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className,
  tx,
  txOptions,
  ...props
}) => {
  const { t } = useTranslation("common");
  const paragraphStyle = cn("text-sm text-gray-500", className);

  const paragraphText = tx ? t(tx, { ...txOptions }) : children;

  return (
    <p className={paragraphStyle} {...props}>
      {paragraphText}
    </p>
  );
};

export { Heading, Paragraph };
