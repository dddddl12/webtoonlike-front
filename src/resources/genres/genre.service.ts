import "server-only";
import prisma from "@/utils/prisma";
import { GenreFormSchema, GenreFormT, GenreT } from "@/resources/genres/genre.dto";
import { Prisma } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { returnValidationErrors } from "next-safe-action";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { BadRequestError } from "@/handlers/errors";
import genreHelper from "@/resources/genres/genre.helper";
import GenreHelper from "@/resources/genres/genre.helper";

const duplicateHandler = async (e: Error) => {
  // 중복 에러 처리
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    const t = await getTranslations("errors.invalidFields");
    returnValidationErrors(
      GenreFormSchema,
      Object.fromEntries(((e.meta?.target || []) as string[])
        .map(name => [
          name, {
            _errors: [t("duplicateValue")]
          }
        ])
      )
    );
  }
  throw e;
};

class GenreService {
  async get(genreId: number): Promise<GenreT> {
    const r = await prisma.genre.findUniqueOrThrow({
      where: {
        id: genreId, }
    });
    const locale = await getLocale();
    return GenreHelper.mapToDto(r, locale);
  }

  async create(formData: GenreFormT) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.genre.create({
      data: formData,
    }).catch(duplicateHandler);
  }

  async update(genreId: number, formData: GenreFormT) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.genre.update({
      data: formData,
      where: {
        id: genreId,
      }
    }).catch(duplicateHandler);
  }

  async delete(genreId: number) {
    await prisma.genre.delete({
      where: {
        id: genreId,
      }
    }).catch(e => {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestError({
          title: "장르 삭제 실패",
          message: "이 장르를 사용 중인 웹툰이 존재합니다."
        });
      }
      throw e;
    });
  }

  async list() {
    const records = await prisma.genre.findMany({
      orderBy: [
        {
          rank: "asc"
        },
        {
          createdAt: "asc"
        }
      ],
    });
    const locale = await getLocale();
    return records.map(r=>
      genreHelper.mapToDto(r, locale));
  }
}
const genreService = new GenreService();
export default genreService;