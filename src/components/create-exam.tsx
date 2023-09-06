import { QuizDifficulty } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { api } from "@/lib/api";
import useStore from "@/hooks/useStore";
import {
  type CreateQuizRequestType,
  createQuizSchema,
} from "@/server/validators";
import React from "react";
import type { QuizWithQuestions } from "types";
import { useToast } from "@/hooks/useToast";
import { env } from "@/env.mjs";

export function CreateConfig() {
  const { currentTopic, setCurrentQuiz, currentSubTopic, setCurrentStep } =
    useStore();

  const { toast } = useToast();

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
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex  shrink-0 items-center justify-center rounded-md border border-dashed">
      <ScrollArea className="h-fit w-full">
        <Card>
          <CardHeader>
            <CardTitle>Lets build your exam</CardTitle>
            <CardDescription>
              What area are you having problems with?
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Difficulty</FormLabel>
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
                        <FormLabel>Subtopic</FormLabel>
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
                        Questions
                        <span className="text-gray-500">
                          {`   (${field.value} questions)`}
                        </span>
                      </FormLabel>
                      <FormDescription>
                        How many questions would you like to solve in this
                        session.
                      </FormDescription>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={createQuizMutation.isLoading}
                          max={20}
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
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How would you like the AI to generate your exam?
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
                  type="submit"
                  disabled={createQuizMutation.isLoading}
                >
                  {createQuizMutation.isLoading ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      <span className="ml-2">Generating</span>
                    </>
                  ) : (
                    `Submit (${env.NEXT_PUBLIC_CREDITS_PER_QUIZ} credits)`
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </ScrollArea>
    </div>
  );
}
