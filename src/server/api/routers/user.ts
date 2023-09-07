import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { profileSchema } from "@/server/schemas";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user.email as string,
      },
      select: {
        name: true,
        credits: true,
      },
    });
  }),
  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.prisma.user.update({
          where: {
            email: ctx.session?.user.email as string,
          },
          data: {
            name: input.name,
          },
        });

        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update profile",
        });
      }
    }),
});
