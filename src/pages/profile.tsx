import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { profileSchema, type ProfileRequestType } from "@/server/schemas";
import SettingsLayout from "@/components/user/sidebar-nav";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { api } from "@/lib/api";
import { Languages, cn } from "@/lib/utils";
import { useMixpanel } from "@/lib/mixpanel";

const languages = [
  { label: "Arabic", value: "ar" },
  { label: "Chinese", value: "cn" },
  { label: "German", value: "de" },
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Italian", value: "it" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
] as const;

const ProfilePage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { t, i18n } = useTranslation("common");
  const { trackEvent } = useMixpanel();

  const { data: profile } = api.user.get.useQuery();

  const form = useForm<ProfileRequestType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || profile?.name || "",
      language: session?.user.lang || (profile?.lang as Languages) || "en",
    },
  });

  const updateProfileMutation = api.user.update.useMutation({
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `Your profile has been updated`,
      });
      update({
        ...session,
        user: {
          ...session?.user,
          name: variables.name,
          lang: variables.language,
        },
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  async function onSubmit(data: ProfileRequestType) {
    try {
      await updateProfileMutation.mutateAsync(data);
      i18n.changeLanguage(data.language ?? "en");
      onToggleLanguageClick(data.language ?? "en");
      trackEvent("FormSubmission", {
        label: "Profile",
        ...data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("profile.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("profile.message")}
          </p>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.name.title")}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      placeholder={t("profile.name.placeholder") as string}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("profile.name.desc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("profile.language.title")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select language"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>
                          {t("profile.language.empty")}
                        </CommandEmpty>
                        <CommandGroup>
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("language", language.value);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {language.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {t("profile.language.desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateProfileMutation.isLoading}>
              {updateProfileMutation.isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t("profile.update")
              )}
            </Button>
          </form>
        </Form>
      </div>
    </SettingsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || "en", ["common"])),
    },
  };
};

export default ProfilePage;
