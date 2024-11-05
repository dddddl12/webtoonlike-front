import { useState } from "react";
import { UserTypeT } from "@/resources/users/user.types";
import UserTypeSelector from "@/components/Account/BasicUserInfo/UserTypeSelector";
import ProfileForm from "@/components/Account/BasicUserInfo/ProfileForm";

export default function BasicUserInfo() {
  const [userType, setUserType] = useState<UserTypeT | undefined>();
  return userType ?
    <ProfileForm userType={userType} setUserType={setUserType} /> :
    <UserTypeSelector setUserType={setUserType} />;
}
