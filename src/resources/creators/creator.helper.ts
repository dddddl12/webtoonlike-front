import "server-only";
import { Prisma } from "@prisma/client";

class CreatorHelper {
  adminPageQuery = Prisma.validator<Prisma.CreatorDefaultArgs>()({
    select: {
      id: true,
      name: true,
      isExposed: true,
      user: {
        select: {
          name: true,
          createdAt: true
        }
      }
    }
  });
  adminPageMapToDTO = (r: Prisma.CreatorGetPayload<typeof this.adminPageQuery>) => ({
    id: r.id,
    name: r.name,
    isExposed: r.isExposed,
    user: {
      name: r.user.name,
      createdAt: r.user.createdAt
    }
  });
}

const creatorHelper = new CreatorHelper();
export default creatorHelper;