"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Topics } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import { ModifySubtopicRequestType } from "@/server/schemas";

const AddSubtopicModal = (props: Pick<ModifySubtopicRequestType, "topic">) => {
  const { toast } = useToast();

  const utils = api.useContext();

  const formSchema = z.object({
    topic: z.nativeEnum(Topics).nullable(),
    subtopic: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subtopic: "",
      topic: props.topic,
    },
  });

  const addSubtopic = api.admin.addSubtopic.useMutation({
    onSuccess: async () => {
      form.reset();
      toast({
        title: "Subtopic Added",
        description: "The subtopic has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error with adding subtopic",
        description: error.message || "There was an error adding the subtopic",
        variant: "destructive",
      });
    },
    onSettled: async () => await utils.meta.getSubtopics.reset(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addSubtopic.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="border-4 border-primary p-10">
          <CardContent className="flex items-center justify-center">
            <h3 className="text-md text-center font-bold">Add New</h3>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="cursor-pointer">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            Add Subtopic
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8 pt-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="subtopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtopic</FormLabel>
                  <FormControl>
                    <Input placeholder="History" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubtopicModal;
