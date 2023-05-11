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
      <div className="w-full text-center lg:w-2/3 bg-blue bg-gradient-to-t  rounded-3xl ">
      <h1 className="bg-gradient-to-t from-zinc-100/50 to-white bg-clip-text py-4 text-center text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
  <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text">
    Check Your Email
  </span>
  <span className="text-white-500 bg-gradient-to-r from-blue-500 to-grey-600 bg-clip-text ml-1">
    !
  </span>
</h1>

        <p className="mb-8 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please
          click the link to complete your account setup.
        </p>
        <div className="flex justify-center space-x-4 mt-8">
          <Button
             variant="outline"
             onClick={() => router.push("/")}
             className=" text-white  font-semibold hover:bg-gray-700 transition duration-300 ease-in-out px-4 py-2 rounded-md">
             Go Home
          </Button>
          <Button
              variant="default"
              onClick={() => router.push("/auth/sign-in")}
              className="bg-gray-500 text-white500 bg-gradient-to-r from-blue-500 to-grey-600 font-semibold hover:bg-gray-700 transition duration-300 ease-in-out px-4 py-2 rounded-md">
                    Sign In
            </Button>
        </div>

      </div>
    </section>
  );
};

export default VerifyRequestPage;
