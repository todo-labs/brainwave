"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";
import Image from "next/image";
import {
  BarChart2Icon,
  CogIcon,
  HomeIcon,
  LayoutDashboardIcon,
  User2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    enabled?: boolean;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  const { t } = useTranslation(["common"]);

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) =>
        item.enabled === false ? null : (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "items-center justify-start"
            )}
          >
            {item.icon && (
              <span className="mr-2 flex-shrink-0">{item.icon}</span>
            )}
            {t(item.title)}
          </Link>
        )
      )}
    </nav>
  );
}

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { data: session } = useSession();

  const sidebarNavItems = [
    {
      icon: <HomeIcon />,
      title: "userNav-home",
      href: "/home",
      enabled: true,
    },
    {
      icon: <User2Icon />,
      title: "userNav-profile",
      href: "/profile",
      enabled: true,
    },
    {
      icon: <CogIcon />,
      title: "userNav-settings",
      href: "/settings",
      enabled: true,
    },
    {
      icon: <BarChart2Icon />,
      title: "userNav-statistics",
      href: "/statistics",
      enabled: true,
    },
    {
      icon: <LayoutDashboardIcon />,
      title: "userNav-dashboard",
      href: "/dashboard",
      enabled: session?.user?.role === Role.ADMIN,
    },
  ];

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
