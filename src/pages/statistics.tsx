import type { NextPage } from "next";

import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user/sidebar-nav";
import PointsCard from "@/components/cards/points-card";
import QuizBreakdown from "@/components/dashboard/quiz-breakdown";
import { LeaderboardTable } from "@/components/leaderboard-table";

import { api } from "@/lib/api";

const StatisticsPage: NextPage = (props) => {
  const quizBreakdown = api.user.quizBreakdown.useQuery();

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Statistics</h3>
          <p className="text-sm text-muted-foreground">
            View your statistics and how you compare to other users.
          </p>
        </div>
        <Separator />
        <section className="flex space-x-3">
          <PointsCard />
          <LeaderboardTable />
        </section>
        <QuizBreakdown queryFn={quizBreakdown} />
      </div>
    </SettingsLayout>
  );
};

export default StatisticsPage;
