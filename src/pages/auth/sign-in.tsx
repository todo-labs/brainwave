import Image from "next/image";
import Link from "next/link";
import { Command } from "lucide-react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { UserAuthForm } from "@/components/user/auth-form";
import { getServerAuthSession } from "@/server/auth";

export default function AuthenticationPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url(/auth-bg.jpeg)",
            }}
          />
          <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> {t("appName")}
          </Link>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("login-title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("login-subheading")}
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              {t("login-description")}{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("login-terms")}
              </Link>{" "}
              {t("login.and")}{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("login-privacy")}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale || "en", ["common"])),
    },
  };
};
