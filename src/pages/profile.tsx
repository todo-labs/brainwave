import type { NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { profileSchema, type ProfileRequestType } from "@/server/validators";
import SettingsLayout from "@/components/user/SidebarNav";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const ProfilePage: NextPage = () => {
  const { data: profile } = api.user.get.useQuery();

  const form = useForm<ProfileRequestType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
    },
  });

  const { toast } = useToast();

  const updateProfileMutation = api.user.update.useMutation({
    onSuccess() {
      toast({
        title: "Success",
        description: `Your profile has been updated`,
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  async function onSubmit(data: ProfileRequestType) {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update account</Button>
          </form>
        </Form>
      </div>
    </SettingsLayout>
  );
};

export default ProfilePage;
