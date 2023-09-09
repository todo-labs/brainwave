import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsLayout from "@/components/user/sidebar-nav";
import UserTable from "@/components/dashboard/user-table";
import PowerCard from "@/components/dashboard/power-card";
import QuizTable from "@/components/dashboard/quiz-table";

import { api } from "@/lib/api";
import useStore from "@/hooks/useStore";
import QuizBreakdown from "@/components/dashboard/quiz-breakdown";
import { BarChart2Icon, BugIcon, GraduationCapIcon, User2Icon } from "lucide-react";
import ReportTable from "@/components/dashboard/report-table";

export default function DashboardPage() {
  // POWER CARDS
  const totalUsers = api.admin.totalUsers.useQuery();
  const totalQuizzes = api.admin.totalQuizzes.useQuery();
  const averageScore = api.admin.averageScore.useQuery();
  const totalReports = api.admin.totalReports.useQuery();

  const { setDashboardTab, dashboardTab } = useStore();

  return (
    <SettingsLayout>
      <div className="flex h-full w-full flex-col">
        <div className="hidden flex-col md:flex">
          <div className="flex-1 space-y-4 p-4">
            <Tabs value={dashboardTab} className="space-y-4">
              <TabsList>
                <TabsTrigger
                  value="overview"
                  onClick={() => setDashboardTab("overview")}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="user-management"
                  onClick={() => setDashboardTab("user-management")}
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  onClick={() => setDashboardTab("reports")}
                >
                  {" "}
                  Reports
                </TabsTrigger>
                <TabsTrigger
                  value="quizzes"
                  onClick={() => setDashboardTab("quizzes")}
                >
                  Quizzes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <PowerCard 
                    query={totalUsers} 
                    title="Users" 
                    icon={User2Icon}
                    />
                  <PowerCard 
                    query={totalQuizzes} 
                    title="Quizzes" 
                    icon={GraduationCapIcon}
                    />
                  <PowerCard 
                    query={averageScore} 
                    title="Avg Score" 
                    icon={BarChart2Icon}
                  />
                  <PowerCard 
                    query={totalReports} 
                    title="Reports" 
                    icon={BugIcon}
                    />
                </div>
                <QuizBreakdown />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  {/* <StudyGuideBacklog /> */}
                </div>
              </TabsContent>
              <TabsContent value="user-management">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <UserTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reports">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Reported Bugs</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ReportTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schools">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Universities</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/* <SchoolTable /> */}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="quizzes">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <QuizTable />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
