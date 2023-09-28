import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user/sidebar-nav";
import PointsCard from "@/components/cards/points-card";
import QuizBreakdown from "@/components/dashboard/quiz-breakdown";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ReportModal } from "@/modals/Report";

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
          <h3 className="text-lg font-medium">{t("statistics-title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("statistics-message")}
          </p>
        </div>
        <Separator />
        <section className="flex space-x-3">
          <PointsCard />
          <LeaderboardTable />
        </section>
        <QuizBreakdown queryFn={quizBreakdown} />
      </div>
      <ReportModal />
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
