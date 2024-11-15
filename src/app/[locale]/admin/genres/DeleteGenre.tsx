import { BasicGenreT, deleteGenre } from "@/resources/genres/genre.service";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/shadcn/ui/alert-dialog";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";

type SubmissionState = "initial" | "loading" | "success" | "failure";
export default function DeleteGenre({ reloadOnUpdate, genre, children }: {
  reloadOnUpdate: () => void;
  genre: BasicGenreT;
  children: ReactNode;
}) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("initial");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      setSubmissionState("initial");
    }
  }, [open]);
  useEffect(() => {
    if (submissionState === "success") {
      setOpen(false);
      reloadOnUpdate();
    }
  }, [reloadOnUpdate, submissionState]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <DeleteAlertDialogHeaderAndFooter
          genre={genre}
          submissionState={submissionState}
          setSubmissionState={setSubmissionState} />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteAlertDialogHeaderAndFooter({ genre, submissionState, setSubmissionState }:{
  genre: BasicGenreT;
  submissionState: SubmissionState;
  setSubmissionState: Dispatch<SetStateAction<SubmissionState>>;
}) {
  const { toast } = useToast();
  const onSubmit = async () => {
    setSubmissionState("loading");
    const { isSuccess } = await deleteGenre(genre.id);
    if (isSuccess) {
      toast({
        description: "장르가 삭제되었습니다."
      });
      setSubmissionState("success");
    } else {
      setSubmissionState("failure");
    }
  };
  if (submissionState === "failure") {
    return <FailureAlertDialogContent genre={genre}/>;
  }
  return <>
    <AlertDialogHeader>
      <AlertDialogTitle>장르 삭제</AlertDialogTitle>
      <AlertDialogDescription>
        {`장르 ${genre.label}를 삭제하시겠습니까?`}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <Button onClick={onSubmit} disabled={submissionState === "loading"}>
        삭제
      </Button>
    </AlertDialogFooter>
  </>;
}

function FailureAlertDialogContent({ genre }:{
  genre: BasicGenreT;
}) {
  return <>
    <AlertDialogHeader>
      <AlertDialogTitle>장르 삭제 실패</AlertDialogTitle>
      <AlertDialogDescription>
        {`${genre.label} 장르를 사용 중인 웹툰이 존재합니다.`}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>닫기</AlertDialogAction>
    </AlertDialogFooter>
  </>;
}
