import "server-only";
import { getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { NonAdminUserSearchQueryT } from "@/resources/users/controllers/userAdmin.controller";
import { AdminPageAccountT } from "@/resources/users/dtos/userAdmin.dto";

class UserAdminService {
  async list({ page }: { page: number}) {
    await getTokenInfo({
      admin: true,
    });
    const limit = 5;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          name: true,
          userType: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);
    const items: AdminPageAccountT[] = records.map(r => {
      return {
        id: r.id,
        name: r.name,
        userType: r.userType as UserTypeT,
        createdAt: r.createdAt
      };
    });
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async searchNonAdminUsers({ q }: NonAdminUserSearchQueryT) {
    await getTokenInfo({
      admin: true,
    });
    const records = await prisma.user.findMany({
      take: 10,
      where: {
        AND: [
          {
            admin: {
              is: null
            }
          },
          {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive"
                }
              },
              {
                email: {
                  contains: q,
                  mode: "insensitive"
                }
              }
            ]
          }
        ]
      },
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true
      }
    });
    return records.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      userType: r.userType as UserTypeT
    }));
  }
}

const userAdminService = new UserAdminService();
export default userAdminService;