"use client";
import AddOrUpdateGenre from "./AddOrUpdateGenre";
import { IconDelete } from "@/components/svgs/IconDelete";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Spinner from "@/components/Spinner";
import { Col, Row } from "@/shadcn/ui/layouts";
import { useEffect, useState } from "react";
import { BasicGenreT, listGenres } from "@/resources/genres/genre.service";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import DeleteGenre from "@/app/[locale]/admin/genres/DeleteGenre";


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
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }
  }, [loaded]);
  const reloadOnUpdate = () => setLoaded(false);
  return <>
    <Row>
      <AddOrUpdateGenre onGenreAddSuccess={reloadOnUpdate}>
        <Button>장르 추가</Button>
      </AddOrUpdateGenre>
    </Row>
    <Row className="flex-wrap gap-x-4 gap-y-3">
      {loaded && <GenreContainer reloadOnUpdate={reloadOnUpdate}/>}
    </Row>
  </>;
}

function GenreContainer({ reloadOnUpdate }: {
  reloadOnUpdate: () => void;
}) {
  const [genres, setGenres] = useState<BasicGenreT[]>();
  useEffect(() => {
    listGenres()
      .then(setGenres);
  },[]);

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