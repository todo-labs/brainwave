import React, { useCallback } from "react";
import { Topics } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "../ui/badge";

import { cleanEnum, cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

import { z } from "zod";
import { Input } from "../ui/input";
import { api } from "@/lib/api";
import { Button } from "../ui/button";
import "@uploadthing/react/styles.css";

export const QuizConfigEditor: React.FC = () => {
  const [selected, setSelected] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = React.useState<Topics>();
  const { toast } = useToast();

  const getSubTopics = api.meta.getSubtopics.useQuery(
    {
      topic: selectedTopic as Topics,
    },
    {
      enabled: !!selectedTopic,
    }
  );

  const addSubtopic = api.meta.addSubtopic.useMutation({
    onSuccess: () => {
      toast({
        title: "Subtopic Added",
        description: "The subtopic has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error with adding subtopic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const schema = z.object({
    topic: z.nativeEnum(Topics),
    subtopic: z.string(),
  });

  type CreateQuizRequestType = z.infer<typeof schema>;

  const form = useForm<CreateQuizRequestType>({
    resolver: zodResolver(schema),
    defaultValues: {
      topic: selectedTopic,
    },
  });

  async function onSubmit(values: CreateQuizRequestType) {
    try {
      await addSubtopic.mutateAsync(values);
    } catch (err) {
      console.log(err);
    }
  }

  const EditDialog = () => {
    return (
      <Dialog open={selected} onOpenChange={(open) => setSelected(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {selectedTopic} Documents
            </DialogTitle>
            <DialogDescription>
              Here is where you can upload document that will be used to provide
              context for the quiz. Our system will parse the documents and
              generate questions based on the content.
            </DialogDescription>
            {getSubTopics.isLoading && <p>Loading...</p>}
            {getSubTopics.isError && <p>Error...</p>}
            {getSubTopics.data?.map((subtopic) => {
              return (
                <Badge key={subtopic} className="mr-2">
                  {subtopic}
                </Badge>
              );
            })}
            <Form {...form}>
              <form className="pt-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="subtopic"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <Input
                        {...field}
                        placeholder="Choose an appropriate sub topic"
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Subtopic</Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sub Topics</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className=" flex flex-col ">
        <section className="flex flex-wrap">
          {Object.keys(Topics).map((topic, index) => {
            return (
              <Card
                key={index}
                className={cn(
                  "mr-3 flex max-w-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 text-center hover:border-4 hover:border-primary hover:text-white xl:m-3",
                  {
                    "border-4 border-primary bg-primary shadow-lg":
                      selectedTopic === topic,
                  }
                )}
                onClick={() => {
                  setSelected(!selected);
                  setSelectedTopic(topic as Topics);
                }}
              >
                <CardDescription>
                  <h1
                    className={cn("font-medium", {
                      "text-white": selected,
                    })}
                  >
                    {cleanEnum(topic)}
                  </h1>
                </CardDescription>
              </Card>
            );
          })}
        </section>
        <EditDialog />
      </CardContent>
    </Card>
  );
};

export default QuizConfigEditor;
