import {
  Body,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { Tailwind } from "@react-email/tailwind";

interface MagicLinkEmailProps {
  url?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export function MagicLinkEmail(props: MagicLinkEmailProps) {
  return (
    <Tailwind>
      <Preview>Log in with this magic link.</Preview>
      <Body className="bg-white font-sans">
        <Container className="mx-auto bg-cover bg-bottom bg-no-repeat px-4 py-8">
          <Img
            src={`${baseUrl}/logo.svg`}
            width={48}
            height={48}
            alt="Brainwave"
            className="mx-auto mb-8"
          />
          <Heading className="mb-8 text-4xl font-bold">
            🪄 Your magic link
          </Heading>
          <Section className="mb-8">
            <Text className="mb-4 text-lg leading-6">
              <Link className="text-primary" href={props.url}>
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text className="text-lg leading-6">
              If you didn't request this, please ignore this email.
            </Text>
          </Section>
          <Text className="mb-4 text-lg leading-6">
            Best,
            <br />- Brainwave Team
          </Text>
          <Hr className="my-8 border-gray-400" />
          <Img
            src={`${baseUrl}/logo.svg`}
            width={32}
            height={32}
            className="mx-auto mb-4 grayscale filter"
          />
          <Text className="text-sm text-gray-600">Brainwave.quest</Text>
        </Container>
      </Body>
    </Tailwind>
  );
}
