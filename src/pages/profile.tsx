import type { NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import SettingsLayout from "@/components/user/sidebar-nav";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";

const ProfilePage: NextPage = (props) => {
  const { data: session, update } = useSession();

  const form = useForm<ProfileRequestType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
    },
  });

  const { toast } = useToast();

  const updateProfileMutation = api.user.update.useMutation({
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `Your profile has been updated`,
      });
      update({
        ...session,
        user: {
          ...session?.user,
          name: variables.name,
        },
      });
    },
    onError: (error) => {
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
            timezone. (Coming soon)
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
