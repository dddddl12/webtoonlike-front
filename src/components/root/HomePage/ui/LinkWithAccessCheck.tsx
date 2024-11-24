import { Link } from "@/i18n/routing";
import { ComponentProps, FC } from "react";
import useTokenInfo from "@/hooks/tokenInfo";
import { AdminLevel } from "@/resources/tokens/token.types";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { useAlert } from "@/hooks/alert";

interface LinkProps extends Omit<ComponentProps<typeof Link>, "onClick"> {
  creatorUid?: number;
  disabled?: boolean;
}

const LinkWithAccessCheck: FC<LinkProps> = ({ creatorUid, disabled, ...props }) => {
  const isAccessible = useDetermineAccess(creatorUid);
  const alert = useAlert({
    title: "바이어 계정으로 로그인해주세요.",
    message: "바이어 계정으로만 접근 가능한 작품입니다."
  });

  return <Link {...props} onClick={(e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (isAccessible) {
      return;
    }
    e.preventDefault();
    alert.open();
  }}/>;
};
export default LinkWithAccessCheck;

function useDetermineAccess(creatorUid?: number) {
  const { tokenInfo, isLoaded } = useTokenInfo();
  if (!isLoaded) {
    // 낮은 확률로 토큰이 아직 로드되지 않았을 때 접근을 시도하면 허용하고
    // 이후 개별 작품 페이지에서 접근 가능 여부 판단
    return true;
  }
  if (!tokenInfo) {
    // 로그인되지 않은 경우 접근 거부
    return false;
  }
  if (tokenInfo.metadata.adminLevel >= AdminLevel.Admin) {
    // 관리자 계정 여부
    return true;
  }
  if (tokenInfo.metadata.type === UserTypeT.Buyer) {
    // 바이어 계정 여부
    return true;
  }
  // 저작권자 본인 작품 여부
  return tokenInfo.userId === creatorUid;
}