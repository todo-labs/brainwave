import React from "react";
import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { getServerAuthSession } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
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

const VerifyRequestPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { t } = useTranslation(["common"]);

  return (
    <section className="body-font mx-auto flex h-screen flex-col items-center justify-center space-y-4 px-5 py-24">
      <div className="w-full text-center lg:w-2/3">
        <h1 className="title-font mb-4 text-3xl font-medium  sm:text-4xl">
          {t("verifyEmail-title")}
        </h1>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          {t("verifyEmail-desc")}
        </p>
        <div className="flex justify-center space-x-5">
          <Button>{t("verifyEmail-resend")}</Button>
          <Button onClick={() => router.back()} variant="secondary">
            {t("verifyEmail-goBack")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VerifyRequestPage;
