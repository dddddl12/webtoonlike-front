"use client";
import { useRouter } from "@/i18n/routing";
import { ClerkLoaded, useSession } from "@clerk/nextjs";
import { createContext, Dispatch, JSX, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { useToast } from "@/shadcn/hooks/use-toast";
import { useTranslations } from "next-intl";
import {
  UserAccountFormT, UserAccountWithBuyerFormSchema, UserAccountWithCreatorFormSchema,
  UserFormSchema,
  UserFormT
} from "@/resources/users/dtos/user.dto";
import UserBasicFieldSet from "@/components/forms/account/fieldsets/UserBasicFieldSet";
import { useForm } from "react-hook-form";
import UserAddressFieldSet from "@/components/forms/account/fieldsets/UserAddressFieldSet";
import useSafeActionForm from "@/hooks/safeActionForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { Form, FormControl, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Col, Row } from "@/components/ui/common";
import { Checkbox } from "@/shadcn/ui/checkbox";
import Terms from "@/components/forms/account/components/Terms";
import { Button } from "@/shadcn/ui/button";
import UserTypeSelector from "@/components/forms/account/fieldsets/UserTypeSelector";
import useCreatorFieldSet from "@/components/forms/account/fieldsets/CreatorFieldSet";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { createBuyerUser, createCreatorUser } from "@/resources/users/controllers/user.controller";
import useBuyerFieldSet from "@/components/forms/account/fieldsets/BuyerFieldSet";

enum SignUpStage {
  SelectUserType = 0,
  FillUserInfo = 1,
  FillRoleInfo = 2
}
type SignUpContextValue = {
  userAccount: Partial<UserAccountFormT>;
  setUserAccount: Dispatch<SetStateAction<Partial<UserAccountFormT>>>;
  signUpStage: SignUpStage;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
};
const SignUpContext = createContext<SignUpContextValue>(
  {} as SignUpContextValue
);

export default function SignUpCompleteForm ({ clerkUserFullName }: {
  clerkUserFullName: string;
}) {
  const [signUpStage, setSignUpStage] = useState<SignUpStage>(SignUpStage.SelectUserType);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, [signUpStage]);

  const [userAccount, setUserAccount] = useState<Partial<UserAccountFormT>>({
    name: clerkUserFullName
  });
  return <SignUpContext.Provider value={{
    userAccount, setUserAccount, signUpStage, setSignUpStage
  }}>
    <SignUpCompleteFormContent/>
  </SignUpContext.Provider>;
}

function SignUpCompleteFormContent () {
  const { signUpStage, setUserAccount, userAccount, setSignUpStage } = useContext(SignUpContext);
  switch (signUpStage) {
    case SignUpStage.SelectUserType:
      return <UserTypeSelector onSelect={(userType: UserTypeT) => {
        setUserAccount(prev => ({
          ...prev,
          userType
        }));
        setSignUpStage(prev => prev + 1);
      }}/>;
    case SignUpStage.FillUserInfo:
      return <UserInfoForm/>;
    case SignUpStage.FillRoleInfo:
      if (userAccount.userType === UserTypeT.Creator) {
        return <CreatorForm/>;
      } else if (userAccount.userType === UserTypeT.Buyer) {
        return <BuyerForm/>;
      } else {
        throw new Error("No user type");
      }
  }
}

function UserInfoForm() {
  const { userAccount, setUserAccount, setSignUpStage } = useContext(SignUpContext);
  const updateUserAccount = useCallback((formData: UserFormT) => {
    setUserAccount(prev => {
      if (prev.userType === UserTypeT.Creator) {
        return {
          ...formData,
          creator: prev.creator,
        };
      } else if (prev.userType === UserTypeT.Buyer) {
        return {
          ...formData,
          buyer: prev.buyer,
        };
      } else {
        return formData;
      }
    });
  }, [setUserAccount]);

  const form = useForm<UserFormT>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: userAccount,
    mode: "onChange",
  });
  const [isAgreed, setIsAgreed] = useState(false);
  const { formState: { isValid }, handleSubmit } = form;
  const tGeneral = useTranslations("general");
  const tSetupForm = useTranslations("setupForm");
  const tUserType = useTranslations("userType");
  return <Form {...form} schema={UserFormSchema}>
    <form onSubmit={handleSubmit(data => {
      updateUserAccount(data);
      setSignUpStage(prev => prev + 1);
    })}
    className={clsx("flex flex-col gap-8 [&_fieldset]:space-y-5")}>
      <span>
        {tSetupForm("selectedUserType", {
          userType: tUserType(userAccount.userType)
        })}
      </span>
      <UserBasicFieldSet form={form}/>
      <hr/>
      <UserAddressFieldSet form={form}/>
      <hr/>
      <Col className="border rounded-sm">
        <FormItem className="p-3 border-b" forcedIsInline={true}>
          <FormControl>
            <Checkbox
              checked={isAgreed}
              onCheckedChange={(checked) => {
                setIsAgreed(Boolean(checked));
              }}
            />
          </FormControl>
          <FormLabel>
            {tSetupForm("doYouAgree")}
          </FormLabel>
        </FormItem>
        <Col className={clsx("p-3 h-[233px] overflow-y-scroll bg-gray-light text-sm",
          "[&_h1]:font-bold [&_h1]:text-base")}>
          <Terms/>
        </Col>
      </Col>
      <Row className="justify-between gap-3">
        <Button
          className="flex-1"
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            const values = form.getValues();
            updateUserAccount(values);
            setSignUpStage(prev => prev - 1);
          }}
        >
          {tGeneral("goBack")}
        </Button>
        <Button
          className="flex-1"
          disabled={!isValid || !isAgreed}
          type="submit"
        >
          {tGeneral("goNext")}
        </Button>
      </Row>
    </form>
  </Form>;
}

function CreatorForm() {
  const { userAccount } = useContext(SignUpContext);
  const router = useRouter();
  const { toast } = useToast();
  const tSetupForm = useTranslations("setupForm");

  const { session } = useSession();
  const safeActionFormReturn = useSafeActionForm(
    createCreatorUser, {
      resolver: zodResolver(UserAccountWithCreatorFormSchema),
      defaultValues: userAccount.userType === UserTypeT.Creator ? userAccount : undefined,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: tSetupForm("completeToast")
          });
          session?.touch().then(() => {
            router.refresh();
            window.scrollTo({
              top: 0,
              behavior: "instant"
            });
          });
        }
      },
      beforeSubmission: async () => {
        await creatorFieldSet.beforeSubmission();
      }
    });

  const creatorFieldSet = useCreatorFieldSet(safeActionFormReturn.form);
  return <RoleFormContent
    safeActionFormReturn={safeActionFormReturn}
    fieldSetElement={creatorFieldSet.element}
    schema={UserAccountWithCreatorFormSchema}
  />;
}

function BuyerForm() {
  const { userAccount } = useContext(SignUpContext);
  const router = useRouter();
  const { toast } = useToast();
  const tSetupForm = useTranslations("setupForm");

  const { session } = useSession();
  const safeActionFormReturn = useSafeActionForm(
    createBuyerUser, {
      resolver: zodResolver(UserAccountWithBuyerFormSchema),
      defaultValues: userAccount.userType === UserTypeT.Buyer ? userAccount : undefined,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: tSetupForm("completeToast")
          });
          session?.touch().then(() => {
            router.refresh();
            window.scrollTo({
              top: 0,
              behavior: "instant"
            });
          });
        }
      },
      beforeSubmission: async () => {
        await buyerFieldSet.beforeSubmission();
      }
    });
  const buyerFieldSet = useBuyerFieldSet(safeActionFormReturn.form);
  return <RoleFormContent
    safeActionFormReturn={safeActionFormReturn}
    fieldSetElement={buyerFieldSet.element}
    schema={UserAccountWithBuyerFormSchema}
  />;
}

function RoleFormContent({ safeActionFormReturn, fieldSetElement, schema }: {
  safeActionFormReturn: ReturnType<typeof useSafeActionForm>;
  fieldSetElement: JSX.Element;
  schema: typeof UserAccountWithCreatorFormSchema | typeof UserAccountWithBuyerFormSchema;
}) {
  const { form, onSubmit, isFormSubmitting } = safeActionFormReturn;
  const { formState: { isValid } } = form;
  const { setUserAccount, setSignUpStage } = useContext(SignUpContext);
  const tGeneral = useTranslations("general");
  return (
    <ClerkLoaded>
      <Form {...form} schema={schema}>
        <form
          onSubmit={onSubmit}
          className={clsx("flex flex-col gap-8 [&_fieldset]:space-y-5", {
            "form-overlay": isFormSubmitting
          })}
        >
          {fieldSetElement}
          <Row className="justify-between gap-3">
            <Button
              className="flex-1"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                const values = form.getValues();
                setUserAccount(values);
                setSignUpStage(prev => prev - 1);
              }}
            >
              {tGeneral("goBack")}
            </Button>
            <Button
              className="flex-1"
              disabled={!isValid}
              type="submit"
            >
              {tGeneral("submit")}
            </Button>
          </Row>
        </form>
      </Form>
    </ClerkLoaded>
  );
}