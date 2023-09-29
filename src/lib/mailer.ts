import { createTransport } from "nodemailer";
import { render } from "@react-email/render";

import QuizCompletionEmail from "@/emails/quiz-completion";

import { env } from "@/env.mjs";

const subjects = {
  quizCompletion: {
    subject: "Quiz Completion",
    component: QuizCompletionEmail,
  },
};

export async function sendEmail(
  to: string,
  key: keyof typeof subjects,
  props: any
) {
  try {
    const { subject, component } = subjects[key];
    const transport = createTransport({
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT),
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
      secure: false,
    });
    await transport.sendMail({
      to,
      from: env.EMAIL_FROM,
      subject,
      html: render(component(props)),
    });
  } catch (error) {
    console.error("SEND_EMAIL_ERROR", error);
  }
}
