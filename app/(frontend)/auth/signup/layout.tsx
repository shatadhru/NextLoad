"use client";
import { authClient } from "@/payload/auth/client";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

function layout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();
  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-6" />{" "}
      </div>
    );
  } else if (session) {
    router.push("/");
    return null;
  } else {
    return <div>{children}</div>;
  }
}

export default layout;
