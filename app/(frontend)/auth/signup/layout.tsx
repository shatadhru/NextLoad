"use client";
import { authClient } from "@/payload/auth/client";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function SignupLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending || session) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  return <div>{children}</div>;
}
