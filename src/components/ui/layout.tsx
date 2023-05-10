import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

import Meta from "./Meta";
import FullScreenConfetti from "./Confetti";
import { UserNav } from "./UserNav";
import { Brand } from "./Brand";

import { api } from "@/lib/api";

import useStore from "@/store/useStore";
import { Paragraph } from "./Typography";

interface ILayoutProps {
  children: React.ReactNode;
  meta: {
    title: string;
    description: string;
  };
}

const Layout = ({ children, meta }: ILayoutProps) => {
  const { showConfetti, setShowConfetti } = useStore();
  const { data: session } = useSession();
  const profileQuery = api.profile.get.useQuery();

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [setShowConfetti, showConfetti]);

  return (
    <React.Fragment>
      <Meta {...meta} />
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <FullScreenConfetti active={showConfetti} />
        </div>
      )}
      <main className="relative h-screen overflow-hidden bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-col md:space-y-4">
            <section>
              <div className="flex justify-between border-b-2 bg-white px-4 py-6 shadow-md">
                <Brand />
                {session && (
                  <div className="flex space-x-5">
                    {profileQuery.data?.credits && (
                      <div className="flex items-center justify-center">
                        <div className="text-sm font-semibold text-gray-500">
                          <Paragraph
                            tx="credits"
                            className="capitalize"
                            txOptions={{
                              num: profileQuery.data?.credits || 0,
                            }}
                          />
                        </div>
                        <div className="text-2xl font-bold text-gray-800"></div>
                      </div>
                    )}
                    <UserNav />
                  </div>
                )}
              </div>
            </section>
            <div className="h-screen overflow-auto bg-gray-100/50 p-10 pb-24 md:px-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Layout;
