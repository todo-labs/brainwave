import type { Metadata } from "next";
import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbumArtwork } from "@/components/album-artwork";
import { UserNav } from "@/components/UserNav";
import { CreateConfig } from "@/components/createConfig";
import { Sidebar } from "@/components/sidebar";

import useStore from "@/store/useStore";

// import the trpc quiz.ts into the file
// import { quizRouter } from "src/server/api/routers/quiz";

import { Button } from "@/components/ui/button";

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

  // const examList = quizRouter.listExams
  // console.log(examList)
  const { currentTopic } = useStore();

  return (
    <>
      {/* {quizForm()} */}
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
        {/* <Menu /> */}
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="exam" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="exam" className="relative">
                          Pick an Exam
                        </TabsTrigger>
                        <TabsTrigger value="config">Config</TabsTrigger>
                        <TabsTrigger value="live">Live</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <UserNav />
                      </div>
                    </div>
                    <TabsContent
                      value="exam"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold capitalize tracking-tight">
                            Choose your{" "}
                            {currentTopic
                              .replace(/-/g, " ")
                              .toLocaleLowerCase()}{" "}
                            Exam
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Top picks for you. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {new Array(10).fill(null).map((album) => (
                              <AlbumArtwork
                                key={"album.name"}
                                album={{
                                  name: "album.name",
                                  artist: "album.artist",
                                  cover: "https://picsum.photos/250/330",
                                }}
                                className="w-[250px]"
                                aspectRatio="portrait"
                                width={250}
                                height={330}
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
                            {new Array(5).fill(null).map((album) => (
                              <AlbumArtwork
                                key={"album.name"}
                                album={{
                                  name: "album.name",
                                  artist: "album.artist",
                                  cover: "https://picsum.photos/150/150",
                                }}
                                className="w-[150px]"
                                aspectRatio="square"
                                width={150}
                                height={150}
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
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <CreateConfig />
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
