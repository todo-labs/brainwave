import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { AwardIcon } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user/sidebar-nav";
import PointsCard from "@/components/cards/points-card";
import QuizBreakdown from "@/components/dashboard/quiz-breakdown";

import { api } from "@/lib/api";

const StatisticsPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const quizBreakdown = api.user.quizBreakdown.useQuery();

  const { t } = useTranslation(["common"]);

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("statistics.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("statistics.message")}
          </p>
        </div>
        <Separator />
        <section className="flex space-x-3">
          <PointsCard />
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
            <AwardIcon className="h-16 w-16 text-muted-foreground/60 dark:text-muted" />
            <h2 className="text-xl font-bold">Coming soon: Leader board</h2>
            <p className="max-w-sm text-center text-base text-muted-foreground">
              See how you compare to other users on the platform.
            </p>
          </div>
        </section>
        <QuizBreakdown queryFn={quizBreakdown} />
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

export default StatisticsPage;
