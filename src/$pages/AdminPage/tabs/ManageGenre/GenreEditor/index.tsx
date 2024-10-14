"use client";
import React, { useEffect, useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import * as GenreApi from "@/apis/genre";
import { useSnackbar } from "@/hooks/Snackbar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/ui/shadcn/Dialog";
import { Label } from "@/ui/shadcn/Label";
import { Pencil1Icon } from "@radix-ui/react-icons";
import type { GenreFormT, GenreT } from "@backend/types/Genre";


type GenreEditorProps = {
  onGenreEditSuccess: (genre: GenreT) => void
  genre: GenreT
}

export function GenreEditor({
  onGenreEditSuccess,
  genre
}: GenreEditorProps): JSX.Element {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [label_en, setLabel_en] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLabel(genre.label);
    if (!genre.label_en) return;
    setLabel_en(genre.label_en);
  }, []);


  function handleOpenChange(open: boolean): void {
    setEditorOpen(open);
  }

  function handleEditorClose(): void {
    setEditorOpen(false);
  }

  async function handleSubmit(): Promise<void> {
    try {
      const form: GenreFormT = {
        label,
        label_en
      };
      const updated = await GenreApi.update(genre.id, form);
      onGenreEditSuccess(updated);

      setLabel("");
      setEditorOpen(false);
      enqueueSnackbar("장르가 수정되었습니다.", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("장르 수정에 실패했습니다.", { variant: "error" });

    }
  }

  return (
    <>
      <Dialog
        open={editorOpen}
        onOpenChange={handleOpenChange}
      >
        <DialogTrigger>
          <button className="bg-mint rounded-sm w-6 h-6 flex justify-center items-center">
            <Pencil1Icon className="text-white w-5 h-5"/>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>장르 수정하기</DialogTitle>
            <DialogDescription>수정할 장르를 입력해주세요.</DialogDescription>
            <Col>
              <Label htmlFor="ko_genre" className="text-white text-[14pt]">한글</Label>
              <Input
                id="ko_genre"
                type='text'
                value={label}
                placeholder='ex) 로맨스, 액션, 스릴러 등...'
                onChange={(e) => setLabel(e.target.value)}
              />
            </Col>
            <Gap y={2}/>
            <Col>
              <Label htmlFor="en_genre" className="text-white text-[14pt]">영어</Label>
              <Input
                id="en_genre"
                type='text'
                value={label_en}
                placeholder='ex) romance, action, thriller ...'
                onChange={(e) => setLabel_en(e.target.value)}
              />
            </Col>
            <Gap y={2}/>
            <Row className='justify-end'>
              <Button
                variant='ghost'
                onClick={handleEditorClose}
              >
                취소
              </Button>
              <Button
                disabled={label === ""}
                onClick={handleSubmit}
              >
                추가
              </Button>

            </Row>


          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}