import { SignUpPage } from "@/$pages/SignUpPage";

interface SignInProps {
  params: {
    locale: string;
  };
}

export default function SignUp({ params: { locale } }: SignInProps) {
  return <SignUpPage locale={locale}/>;
}
