import type { Metadata, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/user/nav";
import { CreateConfig } from "@/components/create-exam";
import { Sidebar } from "@/components/sidebar";
import PickATopic from "@/components/pick-a-topic";
import Results from "@/components/results";
import PastExams from "@/components/past-exams";
import Exam from "@/components/exam";

import useStore from "@/hooks/useStore";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { currentStep } = useStore();

  return (
    <>
      <div className="">
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
                          Pick an Exam
                        </TabsTrigger>
                        <TabsTrigger value="config">Config</TabsTrigger>
                        <TabsTrigger value="exam">Quiz</TabsTrigger>
                        <TabsTrigger value="result">Results</TabsTrigger>
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
        </div>
      </div>
    </>
  );
}
