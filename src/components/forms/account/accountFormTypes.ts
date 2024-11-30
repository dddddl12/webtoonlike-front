import { UseFormReturn } from "react-hook-form";
import { UserAccountFormT, UserFormT } from "@/resources/users/dtos/user.dto";

export type AccountFormType = UseFormReturn<UserFormT|UserAccountFormT>;