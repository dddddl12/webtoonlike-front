"use client";
import React, { useEffect } from "react";
import { Container, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import * as GenreApi from "@/apis/genre";
import { useListData } from "@/hooks/ListData";
import { useAlertDialog } from "@/hooks/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { GenreAdder } from "./GenreAdder";
import { GenreItem } from "@/components/GenreItem";
import { IconDelete } from "@/components/svgs/IconDelete";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Spinner from "@/components/Spinner";
import type { GenreT, ListGenreOptionT } from "@/types";
import { GenreEditor } from "./GenreEditor";


export function ManageGenre(): JSX.Element {

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const { data: genres$, actions: genresAct } = useListData({
    listFn: GenreApi.list,
  });

  const listOpt: ListGenreOptionT = {
  };

  useEffect(() => {
    genresAct.load(listOpt);
  }, []);

  function handleGenreCreateSuccess(genre: GenreT): void {
    genresAct.load(listOpt, { force: true });
  }

  async function handleGenreDeleteClick(genre: GenreT): Promise<void> {
    const isOk = await showAlertDialog({
      title: "장르 삭제",
      body: `장르 ${genre.label}를 삭제하시겠습니까?`,
      useCancel: true,
      useOk: true,
    });

    if (!isOk) {
      return;
    }

    try {
      await GenreApi.remove(genre.id);
      genresAct.load(listOpt, { force: true });
      enqueueSnackbar("장르가 삭제되었습니다.", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("장르 삭제에 실패했습니다.", { variant: "error" });
    }
  }

  return (
    <Container>
      <Text className='font-bold text-[18pt]'>장르 관리</Text>

      <GenreAdder
        onGenreAddSuccess={handleGenreCreateSuccess}
      />

      <Gap y={4}/>

      {genres$.status == "idle" || genres$.status == "loading" && (
        <Spinner />
      )}

      {genres$.status == "error" && (
        <Text>error..</Text>
      )}

      {genres$.status == "loaded" && genres$.data.length == 0 && (
        <Text>no data</Text>
      )}

      {genres$.status === "loaded" && (
        <Row className="flex-wrap gap-x-2">
          {genres$.data.map((genre) => (
            <div key={genre.id}>
              <Row>
                <GenreItem item={genre} />
                <Row>
                  <GenreEditor genre={genre} onGenreEditSuccess={handleGenreCreateSuccess} />
                  <Gap x={1}/>
                  <button
                    className="bg-red rounded-sm w-6 h-6 flex justify-center items-center"
                    onClick={() => handleGenreDeleteClick(genre)}>
                    <IconDelete className="fill-white "/>
                  </button>
                </Row>
              </Row>
            </div>
          ))}
        </Row>
      )}


      <Gap y={20} />
    </Container>
  );
}