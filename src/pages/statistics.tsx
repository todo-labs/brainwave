import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user/sidebar-nav";
import PointsCard from "@/components/cards/points-card";
import QuizBreakdown from "@/components/dashboard/quiz-breakdown";

import { api } from "@/lib/api";

const StatisticsPage: NextPage = () => {
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
        <section className="grid grid-cols-2 gap-4">
          <PointsCard />
          <QuizBreakdown queryFn={quizBreakdown} />
        </section>
      </div>
    </SettingsLayout>
  );
};

export default StatisticsPage;
