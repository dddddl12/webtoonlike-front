import { SignInPage } from "@/$pages/SignInPage";

interface SignInProps {
  params: {
    locale: string;
  };
}

export default function SignIn({ params: { locale } }: SignInProps) {
  return <SignInPage locale={locale}/>;
}
