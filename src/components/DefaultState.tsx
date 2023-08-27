import React from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface IDefaultStateProps {
  title: string;
  icon?: LucideIcon;
  iconClassName?: string;
  description: string;
  btnText?: string;
  onClick?: () => void;
  size?: "sm" | "lg";
}

export default function DefaultState(props: IDefaultStateProps) {
  const {
    title,
    description,
    btnText,
    onClick,
    size = "lg",
    iconClassName,
  } = props;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {props.icon && (
        <props.icon className={cn("h-28 w-28 text-primary", iconClassName)} />
      )}
      <h1
        className={`mt-10 ${
          size === "sm" ? "text-2xl" : "text-4xl xl:text-6xl"
        } font-medium`}
      >
        {title}
      </h1>
      <p
        className={`mt-5 ${
          size === "lg" ? "w-full text-lg xl:w-1/2" : ""
        } text-center text-gray-400`}
      >
        {description}
      </p>
      {btnText && onClick && <Button onClick={onClick}>{btnText}</Button>}
    </div>
  );
}
