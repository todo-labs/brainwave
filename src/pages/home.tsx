import type { Metadata } from "next";
import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCard from "@/components/QuizCard";
import { UserNav } from "@/components/user/Nav";
import { CreateConfig } from "@/components/createConfig";
import { Sidebar } from "@/components/sidebar";
import Question from "@/components/Question";

import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Topics } from "@prisma/client";

export const metadata: Metadata = {
  title: "Brainwave",
  description:
    "Brainwave is a platform for learning and testing your knowledge.",
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Home() {
  const {
    currentTopic,
    currentQuiz,
    reset,
    currentSubTopic,
    setCurrentSubTopic,
  } = useStore();

  const getSubTopics = api.meta.getSubtopics.useQuery(
    {
      topic: currentTopic,
    },
    {
      enabled: !!currentTopic,
    }
  );

  const getPastExams = api.quiz.getPastExams.useQuery({
    topic: currentTopic,
  });

  React.useEffect(() => {
    reset();
  }, []);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/music-light.png"
          width={1280}
          height={1114}
          alt="Music"
          className="block dark:hidden"
        />
        <Image
          src="/examples/music-dark.png"
          width={1280}
          height={1114}
          alt="Music"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden md:block">
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="config" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList defaultValue="choice">
                        <TabsTrigger
                          value="choice"
                          className="relative"
                          disabled={
                            !!currentQuiz || !currentTopic || !!currentSubTopic
                          }
                        >
                          Pick an Exam
                        </TabsTrigger>
                        <TabsTrigger
                          value="config"
                          disabled={!currentSubTopic || !!currentQuiz}
                        >
                          Config
                        </TabsTrigger>
                        <TabsTrigger value="exam" disabled={!currentQuiz}>
                          Live
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
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold capitalize tracking-tight">
                            Choose your{" "}
                            {currentTopic
                              .replace(/_/g, " ")
                              .toLocaleLowerCase()}{" "}
                            Exam
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Top picks for you. Updated{" "}
                            <span className="text-primary">weekly</span>.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {getPastExams.isLoading && <h1>Loading....</h1>}
                            {getPastExams.isError && <h1>Loading....</h1>}
                            {getSubTopics.data &&
                              getSubTopics.data.map((subtopic) => (
                                <QuizCard
                                  key={subtopic}
                                  title={subtopic}
                                  selected={subtopic === currentSubTopic}
                                  onClick={() => {
                                    setCurrentSubTopic(subtopic);
                                  }}
                                />
                              ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Past Exams (2020-2021)
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your personal playlists. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {getPastExams.isLoading && <h1>Loading....</h1>}
                            {getPastExams.isError && <h1>Loading....</h1>}
                            {getPastExams.data &&
                              getPastExams.data.map((album) => (
                                <QuizCard
                                  key={album.id}
                                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                  title={album.title ?? ""}
                                  onClick={() => {
                                    console.log("clicked");
                                  }}
                                />
                              ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="config"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Create your Exam
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <CreateConfig />
                    </TabsContent>
                    <TabsContent
                      value="exam"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <section className="flex flex-col space-y-4">
                        {currentQuiz &&
                          currentQuiz.questions.map((q) => (
                            <Question
                              key={q.question}
                              question={q}
                              onSubmit={(answer) => {
                                console.log(answer);
                              }}
                            />
                          ))}
                      </section>
                      <Button onClick={() => alert("apply some logic here")}>
                        Submit Quiz
                      </Button>
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
