import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Button } from "@/shadcn/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shadcn/ui/command";
import { useTranslations } from "next-intl";
import useDebounce from "@/hooks/debounce";
import { Badge } from "@/shadcn/ui/badge";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { useToast } from "@/shadcn/hooks/use-toast";
import { createAdmin } from "@/resources/admins/admin.controller";
import { useConfirm } from "@/hooks/alert";
import useSafeAction from "@/hooks/safeAction";
import { NonAdminUserSearchT } from "@/resources/users/dtos/userAdmin.dto";
import { searchNonAdminUsers } from "@/resources/users/controllers/userAdmin.controller";

export default function AddAdmin({ reload }: {
  reload: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<NonAdminUserSearchT[]>();
  const [inputStatus, setInputStatus] = useState<"initial" | "searching" | "complete">("initial");

  useEffect(() => {
    if (open) {
      setUsers([]);
    }
  }, [open]);

  // 검색어
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 100);
  useEffect(() => {
    if (debouncedSearchText) {
      searchNonAdminUsers({ q: debouncedSearchText })
        .then((res) => {
          setUsers(res?.data || []);
          setInputStatus("complete");
        });
    } else {
      setUsers([]);
    }
  }, [debouncedSearchText]);


  // 어드민 추가 시 이벤트
  const { toast } = useToast();
  const { execute: executeAddAdmin } = useSafeAction(createAdmin, {
    onSuccess: () => {
      toast({
        description: "관리자를 추가했습니다."
      });
      reload();
    }
  });

  const handleAddAdmin = (user: NonAdminUserSearchT) => {
    executeAddAdmin({ targetUserId: user.id });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="mint"
          role="combobox"
          aria-expanded={open}
        >
          관리자 추가
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="유저 선택..."
            onValueChange={(rawValue) => {
              const value = rawValue.trim();
              if (value){
                setInputStatus("searching");
              } else {
                setInputStatus("initial");
              }
              setSearchText(value);
            }}
          />
          <CommandList>
            <CommandEmpty>{inputStatus === "initial"
              ? "유저 이름을 입력하세요."
              : (inputStatus === "searching"
                ? "검색 중..."
                : "일치하는 유저가 없습니다.")}</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <UserItem key={user.id} user={user} onAddAdmin={handleAddAdmin}/>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function UserItem({ user, onAddAdmin }: { user: NonAdminUserSearchT; onAddAdmin: (user: NonAdminUserSearchT) => void }) {
  const tUserType = useTranslations("userType");

  const confirm = useConfirm({
    title: "관리자 추가",
    message: `${user.name} 님을 관리자로 추가하시겠습니까?`,
    confirmText: "추가",
    onConfirm: () => onAddAdmin(user),
  });

  return (
    <CommandItem
      key={user.id}
      value={user.id.toString()}
      onSelect={confirm.open}
    >
      <div className="w-full overflow-ellipsis">
        <div className="whitespace-pre flex">
          <span className="overflow-ellipsis overflow-hidden font-semibold">
            {user.name}
          </span>
          <Badge className="ml-2 whitespace-pre text-white"
            variant={user.userType === UserTypeT.Creator ? "grayDark" : "yellow"}>
            {tUserType(user.userType)}
          </Badge>
        </div>
        <div className="overflow-ellipsis overflow-hidden text-gray-shade">
          {user.email}
        </div>
      </div>
    </CommandItem>
  );
}
