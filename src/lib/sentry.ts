import * as Sentry from "@sentry/nextjs";

type Transaction = "CreateExam" | "GradeExam" | "UpdateProfile";

export const useSentry = async (name: Transaction, fn: Promise<void>) => {
  const transaction = Sentry.startTransaction({
    name,
  });

  Sentry.configureScope((scope) => {
    scope.setSpan(transaction);
  });

  try {
    const res = await fn;
    return res;
  } catch (error) {
    Sentry.captureException(error);
  } finally {
    transaction.finish();
  }
};
