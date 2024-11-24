import "server-only";
import { SimpleUserProfileT } from "@/resources/users/dtos/user.dto";
import prisma from "@/utils/prisma";
import { getClerkUser } from "@/resources/tokens/token.service";

class UserService {

  async getSimple(): Promise<SimpleUserProfileT> {
    const clerkUser = await getClerkUser();
    const { name } = await prisma.user.findUniqueOrThrow({
      where: {
        id: parseInt(clerkUser.externalId)
      },
      select: {
        name: true
      }
    });
    return {
      name,
      thumbPath: clerkUser.imageUrl
    };
  }
}

const userService = new UserService();
export default userService;