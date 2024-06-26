import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/user/nav";
import { CreateConfig } from "@/components/tabs/create-exam";
import { Sidebar } from "@/components/sidebar";
import PickATopic from "@/components/tabs/pick-a-topic";
import Results from "@/components/results";
import PastExams from "@/components/tabs/past-exams";
import Exam from "@/components/tabs/exam";
import FullScreenConfetti from "@/components/ui/confetti";
import { ReportModal } from "@/modals/Report";

import useStore from "@/hooks/useStore";
import useLocale from "@/hooks/useLocale";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || "en", ["common"])),
    },
  };
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const { currentStep, showConfetti, currentQuiz, setCurrentStep } = useStore();
  const { t, i18n } = useTranslation(["common"]);
  const { data: session } = useSession();
  const { changeLocale } = useLocale();

  useEffect(() => {
    const locale = session?.user?.lang;
    if (locale !== i18n.language) {
      changeLocale(locale);
    }
  }, [session, router]);

  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar className="hidden lg:block" />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <Tabs
                activationMode="manual"
                value={currentStep}
                className="h-full space-y-6"
              >
                <div className="space-between flex items-center">
                  <TabsList defaultValue="choice">
                    <TabsTrigger value="choice" className="relative">
                      {t("home-tabs-pickAnExam")}
                    </TabsTrigger>
                    <TabsTrigger value="config">
                      {t("home-tabs-config")}
                    </TabsTrigger>
                    <TabsTrigger value="exam">
                      {t("home-tabs-quiz")}
                    </TabsTrigger>
                    <TabsTrigger value="result">
                      {t("home-tabs-results")}
                    </TabsTrigger>
                  </TabsList>
                  <div className="ml-auto mr-4">
                    <UserNav />
                  </div>
                </div>
                <TabsContent
                  value="choice"
                  className="border-none p-0 outline-none"
                >
                  <PickATopic />
                  <PastExams />
                </TabsContent>
                <TabsContent
                  value="config"
                  className="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                  <CreateConfig />
                </TabsContent>
                <TabsContent
                  value="exam"
                  className="h-full flex-col overscroll-contain border-none p-0 data-[state=active]:flex"
                >
                  <Exam />
                </TabsContent>
                <TabsContent
                  value="result"
                  className="border-none p-0 outline-none"
                >
                  <Results />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <ReportModal />
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <FullScreenConfetti active={showConfetti} />
        </div>
      )}
    </div>
  );
}
