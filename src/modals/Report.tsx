import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportType } from "@prisma/client";
import { useTranslation } from "next-i18next";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Heading, Paragraph } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/lib/api";
import { type ReportRequestType, reportSchema } from "@/server/schemas";
import { cleanEnum } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { useMixpanel } from "@/lib/mixpanel";

export function ReportModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation(["common"]);
  const { trackEvent } = useMixpanel();

  const reportApi = api.meta.report.useMutation({
    onSuccess: () => {
      toast({
        title: `${t("toast-generic-success-title")}`,
        description: t("toast-report-success"),
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${t("toast-generic-error-title")}`,
        description: error.message || `${t("toast-report-error")}`,
      });
    },
  });

  const form = useForm<ReportRequestType>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      message: "",
      pageUrl: "",
      userAgent: "",
    },
  });

  const onSubmit = async (values: ReportRequestType) => {
    try {
      await reportApi.mutateAsync({
        ...values,
        pageUrl: window.location.href || "",
        userAgent: window.navigator.userAgent || "",
      });
      trackEvent("FormSubmission", {
        label: "ReportModal",
        pageUrl: window.location.href || "",
        userAgent: window.navigator.userAgent || "",
      });
    } catch (error) {
      trackEvent("FormSubmission", {
        label: "ReportModal",
        value: error,
      });
      console.error(error);
    }
  };

  const handleOpen = () => {
    trackEvent("ViewedModal", {
      label: "Report Modal",
      pageUrl: window.location.href || "",
    });
    setOpen(true);
  };

  const handleCancel = () => {
    trackEvent("ButtonClick", {
      label: "ReportModal",
      value: "Cancel",
      pageUrl: window.location.href || "",  
    });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <AlertDialogTrigger
        asChild
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-lg p-1"
      >
        <MessageSquareIcon
          className="bg-destructive text-white"
          onClick={handleOpen}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Heading level="h3" className="font-display font-bold">
              {t("reportModal-title")}
            </Heading>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Paragraph className="text-sm text-gray-500">
              {t("reportModal-message")}
            </Paragraph>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("reportModal-placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ReportType).map((level) => (
                        <SelectItem key={level} value={level}>
                          {cleanEnum(level)}
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea id="bug report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("cancel")}
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={reportApi.isLoading}
              >
                {reportApi.isLoading && (
                  <Loader2Icon className="h-3 w-3 animate-spin" />
                )}
                {t("submit")}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
