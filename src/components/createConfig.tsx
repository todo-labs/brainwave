import { useCallback, useMemo } from "react";
import { QuestionType, QuizDifficulty } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
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

export function CreateConfig() {
  const { currentTopic, setCurrentQuiz, setCurrentStep } = useStore();
  const createQuizMutation = api.quiz.createExam.useMutation();

  const form = useForm<CreateQuizRequestType>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      difficulty: "EASY",
      questions: 10,
      options: [QuestionType.MCQ],
      university: "",
      notes: "",
      subject: currentTopic,
    },
  });

  const numCredits = useMemo(() => {
    // think of a good credit system
    return 3;
  }, [form.watch]);

  async function onSubmit(values: CreateQuizRequestType) {
    try {
      await createQuizMutation.mutateAsync({
        ...values,
      });
      // setCurrentQuiz(quiz);
      setCurrentStep("exam");
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
                        <FormLabel>Quiz Diffuculuty</FormLabel>
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
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <Input
                          {...field}
                          placeholder="Brown University"
                          disabled={createQuizMutation.isLoading}
                        />
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
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
                        Enter your preferred reading time. Time increments are
                        in 5 mins.
                      </FormDescription>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={createQuizMutation.isLoading}
                          max={50}
                          step={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          Question Types
                        </FormLabel>
                        <FormDescription>
                          Select the items you want to display in the sidebar.
                        </FormDescription>
                      </div>
                      {Object.keys(QuestionType).map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="options"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      item as QuestionType
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>{item}</FormLabel>
                                  <FormDescription>
                                    You can manage your mobile notifications in
                                    the{" "}
                                    <a href="/examples/forms">
                                      mobile settings
                                    </a>{" "}
                                    page.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
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
                        You can{" "}
                        <span className="font-medium text-primary">
                          @mention
                        </span>{" "}
                        other users and organizations.
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
                    `Submit (${numCredits} credits)`
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
