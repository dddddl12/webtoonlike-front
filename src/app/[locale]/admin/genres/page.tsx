"use client";
import AddOrUpdateGenre from "./AddOrUpdateGenre";
import { IconDelete } from "@/components/svgs/IconDelete";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Spinner from "@/components/Spinner";
import { Col, Row } from "@/shadcn/ui/layouts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BasicGenreT, listGenres } from "@/resources/genres/genre.service";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import DeleteGenre from "@/app/[locale]/admin/genres/DeleteGenre";
import { useAction } from "next-safe-action/hooks";


export default function ManageGenresPage() {
  return (
    <Col className="gap-10">
      <p className='font-bold text-[18pt]'>장르 관리</p>
      <ManageGenresContent />
    </Col>
  );
}

function ManageGenresContent() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const reloadOnUpdate = useCallback(() => setLoaded(false), []);
  const [genres, setGenres] = useState<BasicGenreT[]>();

  const boundListGenres = useMemo(() => listGenres, []);
  const { execute } = useAction(boundListGenres, {
    onSuccess: ({ data }) => setGenres(data),
  });
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      return;
    }
    execute();
  }, [execute, loaded]);

  return <>
    <Row>
      <AddOrUpdateGenre onGenreAddSuccess={reloadOnUpdate}>
        <Button>장르 추가</Button>
      </AddOrUpdateGenre>
    </Row>
    <Row className="flex-wrap gap-x-4 gap-y-3">
      <GenreContainer genres={genres} reloadOnUpdate={reloadOnUpdate}/>
    </Row>
  </>;
}

function GenreContainer({ reloadOnUpdate, genres }: {
  reloadOnUpdate: () => void;
  genres?: BasicGenreT[];
}) {

  if (!genres) {
    return <Spinner/>;
  }
  return <>
    {genres.map((genre) => (
      <Row key={genre.id}>
        <Row className="gap-1">
          <Badge>
            {genre.label}
          </Badge>
          <AddOrUpdateGenre prev={genre} onGenreAddSuccess={reloadOnUpdate}>
            <Button
              variant="mint"
              size="smallIcon">
              <Pencil1Icon className="w-5 h-5" />
            </Button>
          </AddOrUpdateGenre>
          <DeleteGenre genre={genre} reloadOnUpdate={reloadOnUpdate}>
            <Button
              variant="red"
              size="smallIcon">
              <IconDelete/>
            </Button>
          </DeleteGenre>
        </Row>
      </Row>
    ))}
  </>;
}