import { CreditCard, LogOut, PlusCircle, Settings, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import router from "next/router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";
import { Paragraph } from "./ui/typography";
import { api } from "@/lib/api";

export function UserNav() {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    if (!lastName) return firstName?.charAt(0);
    if (firstName && lastName.length > 0)
      return `${firstName.charAt(0)}${lastName?.charAt(0)}`;
  };

  const { data: credits } = api.user.getCredits.useQuery();

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={session?.user.image as string}
              alt={session?.user.name as string}
            />
            <AvatarFallback className="border-2 border-primary bg-primary/20">
              {session?.user?.name ? getInitials(session.user.name) : "👻"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <Paragraph>{session?.user.email || "Anonymous"}</Paragraph>
            <p className="text-xs leading-none text-muted-foreground">
              <span className="font-bold text-primary">
                {credits || 0}
              </span>{" "}
              credits remaining
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void router.push(`/profile`)}>
            <User className="mr-2 h-4 w-4" />
            <Paragraph className="capitalize" tx="userNav.profile" />
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void router.push(`/billing`)}>
            <CreditCard className="mr-2 h-4 w-4" />
            <Paragraph className="capitalize" tx="userNav.addCredits" />
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void router.push(`/settings`)}>
            <Settings className="mr-2 h-4 w-4" />
            <Paragraph className="capitalize" tx="userNav.settings" />
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          {session?.user?.role === Role.ADMIN && (
            <DropdownMenuItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              <Paragraph className="capitalize" tx="userNav.dashboard" />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <Paragraph tx="userNav.logout" />
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
