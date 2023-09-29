import { Tailwind } from "@react-email/tailwind";
import { Topics } from "@prisma/client";
import {
  Body,
  Container,
  Heading,
  Section,
  Text,
  Button,
} from "@react-email/components";

import { buttonVariants } from "@/components/ui/button";

import { cleanEnum, cn } from "@/lib/utils";

export type QuizCompletionEmailProps = {
  name: string;
  topic: Topics;
  subtopic: string;
  score: number;
};

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const QuizCompletionEmail = ({
  name,
  score,
  subtopic,
  topic,
}: QuizCompletionEmailProps) => {
  return (
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto px-4 py-8">
          <Heading className="mb-8 text-2xl font-bold">
            Congratulations {name}, on completing your {cleanEnum(topic)}:{" "}
            {subtopic} quiz!
          </Heading>
          <Section className="mb-8">
            <Text className="mb-4 text-lg leading-6">
              You have completed your quiz with a score of{" "}
              <span className="font-bold text-primary">{score}</span>.
            </Text>
            <Button
              href={`${baseUrl}/statistics`}
              className={cn(
                buttonVariants({
                  variant: "default",
                })
              )}
            >
              View Progress
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  );
};

export default QuizCompletionEmail;
