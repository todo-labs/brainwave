import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const ErrorPage: React.FC = (props) => {
  const router = useRouter();
  const { statusCode } = router.query;

  let errorMessage = "An error occurred";
  if (statusCode === "404") {
    errorMessage = "The requested page could not be found";
  } else if (statusCode === "500") {
    errorMessage = "An internal server error occurred";
  }

  const { t } = useTranslation(["common"]);

  return (
    <>
      <Head>
        <title>Error - {statusCode}</title>
      </Head>

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
              backgroundImage: "url(https://images.pexels.com/photos/7092346/pexels-photo-7092346.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
            }}
          />
          <div
            className="relative z-20 flex cursor-pointer items-center text-lg font-medium"
            onClick={() => router.push("/")}
          >
            <Command className="mr-2 h-6 w-6" /> {t("appName")}
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex min-h-screen flex-col items-center justify-center">
              <h1 className="mb-4 text-3xl font-bold">{errorMessage}</h1>
              <p className="mb-8 text-lg">
                Sorry, we were unable to complete your request at this time.
              </p>
              <Button onClick={() => router.push('/auth/sign-in')}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
