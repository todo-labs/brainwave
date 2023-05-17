import React from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Command } from "lucide-react";

import { getServerAuthSession } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";

// import pexel, { Photo } from "pexels";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const data = await pexel.createClient(env.PEXELS_API_KEY!).photos.random();

  return {
    props: {
      // image: data as Photo,
    },
  };
};

const VerifyRequestPage: React.FC = (props) => {
  // const { image } = props;

  const router = useRouter();

  return (
    <section className="body-font mx-auto flex h-screen flex-col items-center justify-center space-y-4 bg-black bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30">
      {/* <Image
        src={image.src.large}
        alt={image.photographer}
        width={200}  
        height={200}
        className="rounded object-cover object-center"
      /> */}
      <div className="relative z-20 flex items-center text-lg font-medium">
        <Command className="mr-2 h-6 w-6" /> Brainwave
      </div>
      <div>
        <h2 className="text-1xl font-semibold tracking-tight">
          Unlocking Your Brain's Potential with BrainWave
        </h2>
      </div>
      <div className="bg-blue w-full rounded-3xl bg-gradient-to-t text-center  lg:w-2/3 ">
        <h1 className="bg-gradient-to-t from-zinc-100/50 to-white bg-clip-text py-4 text-center text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text">
            Check Your Email
          </span>
          <span className="text-white-500 ml-1 bg-gradient-to-r from-blue-500 to-gray-600 bg-clip-text">
            !
          </span>
        </h1>

        <p className="mb-8 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please
          click the link to complete your account setup.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className=" rounded-md  px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-gray-700"
          >
            Go Home
          </Button>
          <Button
            variant="default"
            onClick={() => router.push("/auth/sign-in")}
            className="text-white500 to-grey-600 rounded-md bg-gray-900 bg-gradient-to-r from-blue-500 px-4 py-2 font-semibold transition duration-300 ease-in-out hover:bg-gray-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VerifyRequestPage;
