"use client";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Spinner from "@/components/Spinner";
import { Col, Row } from "@/shadcn/ui/layouts";
import { useEffect, useMemo, useState } from "react";
import { BasicGenreT, listGenres } from "@/resources/genres/genre.service";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import DeleteGenre from "@/app/[locale]/admin/genres/DeleteGenre";
import useSafeAction from "@/hooks/safeAction";
import useReload from "@/hooks/reload";
import GenreForm from "@/components/forms/admin/GenreForm";

// BadRequestError
export default function ManageGenresPage() {
  return (
    <Col className="gap-10">
      <p className='font-bold text-[18pt]'>장르 관리</p>
      <ManageGenresContent />
    </Col>
  );
}

function ManageGenresContent() {
  const { reload, reloadKey } = useReload();
  const [genres, setGenres] = useState<BasicGenreT[]>();

  const boundListGenres = useMemo(() => listGenres, []);
  const { execute } = useSafeAction(boundListGenres, {
    onSuccess: ({ data }) => setGenres(data),
  });
  useEffect(() => {
    execute();
  }, [execute, reloadKey]);

  return <div>
    <Row>
      <GenreForm reload={reload}>
        <Button>장르 추가</Button>
      </GenreForm>
    </Row>
    <Row className="flex-wrap gap-x-4 gap-y-3">
      <GenreContainer genres={genres} reload={reload}/>
    </Row>
  </div>;
}

function GenreContainer({ reload, genres }: {
  reload: () => void;
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
          <GenreForm prev={genre} reload={reload}>
            <Button
              variant="mint"
              size="smallIcon">
              <Pencil1Icon className="w-5 h-5" />
            </Button>
          </GenreForm>
          <DeleteGenre genre={genre} reload={reload} />
        </Row>
      </Row>
    ))}
  </>;
}