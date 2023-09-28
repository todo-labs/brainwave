import React from "react";
import { QuizDifficulty, Role } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useDisclaimerModal from "@/modals/Disclamer";

import { api } from "@/lib/api";
import useStore from "@/hooks/useStore";
import { type CreateQuizRequestType, createQuizSchema } from "@/server/schemas";
import type { QuizWithQuestions } from "types";
import { useToast } from "@/hooks/useToast";
import { env } from "@/env.mjs";
import { useMixpanel } from "@/lib/mixpanel";
import { useSentry } from "@/lib/sentry";

export function CreateConfig() {
  const { currentTopic, setCurrentQuiz, currentSubTopic, setCurrentStep } =
    useStore();

  const { toast } = useToast();
  const { data: session } = useSession();
  const { trackEvent } = useMixpanel();
  const { t } = useTranslation(["common"]);

  const { Content: DisclaimerModal, open } = useDisclaimerModal({
    onConfirm: () => {
      useSentry("CreateExam", form.handleSubmit(onSubmit)())
    },
  });

  const createQuizMutation = api.quiz.createExam.useMutation({
    onSuccess: (data) => {
      setCurrentQuiz(data as QuizWithQuestions);
      setCurrentStep("exam");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    retry: 2,
    retryDelay: 1000,
  });

  const form = useForm<CreateQuizRequestType>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      difficulty: QuizDifficulty.EASY,
      questions: 5,
      subtopic: currentSubTopic as string,
      notes: "",
      subject: currentTopic,
    },
  });

  async function onSubmit(values: CreateQuizRequestType) {
    try {
      const quiz = await createQuizMutation.mutateAsync(values);
      setCurrentQuiz(quiz as QuizWithQuestions);
      trackEvent("FormSubmission", {
        label: "CreateQuiz",
        topic: currentTopic,
        subtopic: currentSubTopic,
        difficulty: values.difficulty,
        questions: values.questions,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex  shrink-0 items-center justify-center rounded-md border border-dashed">
      <ScrollArea className="h-fit w-full">
        <Card>
          <CardHeader>
            <CardTitle>{t("home-config-title")}</CardTitle>
            <CardDescription>{t("home-config-desc")}</CardDescription>
          </CardHeader>
          <Form {...form}>
            <div className="space-y-8">
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("home-config-difficulty")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="area">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(QuizDifficulty).map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                disabled={createQuizMutation.isLoading}
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtopic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("home-config-subtopic")}</FormLabel>
                        <Input {...field} disabled={!!currentSubTopic} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="questions"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>
                        {t("home-config-questions")}
                        <span className="text-gray-500">
                          {t("home-config-questionsLabel", {
                            num: field.value,
                          })}
                        </span>
                      </FormLabel>
                      <FormDescription>
                        {t("home-config-questionDesc")}
                      </FormDescription>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={createQuizMutation.isLoading}
                          max={env.NEXT_PUBLIC_MAX_QUESTIONS_PER_QUIZ}
                          step={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("home-config-notes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            t("home-config-notesPlaceholder") as string
                          }
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("home-config-notesDesc")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="justify-between space-x-2">
                <Button
                  className="w-full"
                  variant="default"
                  disabled={createQuizMutation.isLoading}
                  onClick={open}
                >
                  {createQuizMutation.isLoading ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      <span className="ml-2">
                        {t("home-config-generating")}
                      </span>
                    </>
                  ) : (
                    t("home-config-submit", {
                      num:
                        session?.user.role === Role.ADMIN
                          ? 0
                          : env.NEXT_PUBLIC_CREDITS_PER_QUIZ,
                    })
                  )}
                </Button>
              </CardFooter>
            </div>
          </Form>
        </Card>
      </ScrollArea>
      <DisclaimerModal />
    </div>
  );
}
