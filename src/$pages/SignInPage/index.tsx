import React from "react";
import { SignIn } from "@clerk/nextjs";

export function SignInPage({ locale }: { locale: string }): JSX.Element {
  return (
    <div className='h-screen w-screen'>
      <div className='absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2'>
        <SignIn
          appearance={{
            elements: {
              card: "bg-white",
              headerTitle: "text-black text-3xl",
              headerSubtitle: "text-black",
              internal: "",
              formFieldLabel: "text-black",
              formButtonPrimary:
                "bg-transparent text-black hover:text-mint hover:bg-transparent duration-500",
              footerActionText: "text-black",
              footerActionLink: "text-mint",
              formFieldInput:
                "bg-transparent outline-none border-transparent border-b-2 border-b-mint rounded-none focus:ring-0 focus:outline-none text-black caret-mint rounded-md",
            },
          }}
          signUpUrl={`/${locale}/sign-up`}
        />
      </div>
    </div>
  );
}
