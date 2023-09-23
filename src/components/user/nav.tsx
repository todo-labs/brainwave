import {
  BarChart2Icon,
  InfinityIcon,
  LayoutDashboardIcon,
  LogOut,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import router from "next/router";
import { useTranslation } from "next-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Paragraph } from "../ui/typography";

import { useBuyCredits } from "@/hooks/useBuyCredits";
import { api } from "@/lib/api";
import { Role } from "@prisma/client";
import useStore from "@/hooks/useStore";
import { useMixpanel } from "@/lib/mixpanel";

export function UserNav() {
  const { data: session } = useSession();
  const { buyCredits } = useBuyCredits();
  const { reset } = useStore();
  const { trackEvent } = useMixpanel();

  const profileQuery = api.user.get.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: 0,
  });

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    if (!lastName) return firstName?.charAt(0);
    if (firstName && lastName.length > 0)
      return `${firstName.charAt(0)}${lastName?.charAt(0)}`;
  };

  const handleSignOut = async () => {
    reset();
    trackEvent("Logout");
    await signOut();
  };

  const { t } = useTranslation(["common"]);

  const handleNavigate = (path: string) => {
    router.push(path);
    trackEvent("ButtonClick", {
      label: "UserNav",
      value: path,
    });
  };

  const handleCancel = () => {
    trackEvent("ButtonClick", {
      label: "UserNav",
      value: "Cancel",
    });
  };

  if (!session) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session?.user.image as string}
                alt={session?.user.name as string}
              />
              <AvatarFallback className="border-2 border-primary bg-primary/20 text-primary">
                {session?.user?.name ? getInitials(session.user.name) : "👻"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              {session.user.role === Role.ADMIN ? (
                <div className="flex items-center space-x-2">
                  <Paragraph className="font-bold text-primary">
                    <InfinityIcon className="h-4 w-4" />
                  </Paragraph>
                  <Paragraph className="capitalize">
                    {t("userNav.credits")}
                  </Paragraph>
                </div>
              ) : (
                profileQuery.data?.credits && (
                  <div className="flex items-center space-x-2">
                    <Paragraph className="font-bold text-primary">
                      {profileQuery.data?.credits}
                    </Paragraph>
                    <Paragraph className="capitalize">
                      {t("userNav.credits")}
                    </Paragraph>
                  </div>
                )
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleNavigate(`/profile`)}>
              <User className="mr-2 h-4 w-4" />
              <p className="capitalize">{t("userNav.profile")}</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate(`/settings`)}>
              <Settings className="mr-2 h-4 w-4" />
              <p className="capitalize">{t("userNav.settings")}</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate(`/statistics`)}>
              <BarChart2Icon className="mr-2 h-4 w-4" />
              <p className="capitalize">{t("userNav.statistics")}</p>
            </DropdownMenuItem>
            {session.user.role === Role.ADMIN && (
              <DropdownMenuItem onClick={() => handleNavigate(`/dashboard`)}>
                <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                <p className="capitalize">{t("userNav.dashboard")}</p>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <Button variant="link">
                <LogOut className="mr-2 h-4 w-4" />
                {t("userNav.logout.btn")}
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("userNav.logout.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("userNav.logout.message")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              {t("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
