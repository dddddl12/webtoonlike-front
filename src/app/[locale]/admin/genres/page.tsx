"use client";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Spinner from "@/components/ui/Spinner";
import { Heading2, Row } from "@/components/ui/common";
import { useEffect, useState } from "react";
import { listGenres } from "@/resources/genres/genre.controller";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import DeleteGenre from "@/app/[locale]/admin/genres/DeleteGenre";
import useReload from "@/hooks/reload";
import GenreForm from "@/components/forms/admin/GenreForm";
import { GenreT } from "@/resources/genres/genre.dto";
import useSafeAction from "@/hooks/safeAction";

// BadRequestError
export default function ManageGenresPage() {
  return (
    <>
      <Heading2>장르 관리</Heading2>
      <ManageGenresContent />
    </>
  );
}

function ManageGenresContent() {
  const { reload, reloadKey } = useReload();
  const [genres, setGenres] = useState<GenreT[]>();

  const { execute } = useSafeAction(listGenres, {
    onSuccess: ({ data }) => setGenres(data)
  });
  useEffect(() => {
    execute();
  }, [reloadKey, execute]);

  return <div>
    <Row>
      <GenreForm reload={reload}>
        <Button>장르 추가</Button>
      </GenreForm>
    </Row>
    <Row className="flex-wrap gap-x-4 gap-y-3 mt-10">
      <GenreContainer genres={genres} reload={reload}/>
    </Row>
  </div>;
}

function GenreContainer({ reload, genres }: {
  reload: () => void;
  genres?: GenreT[];
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