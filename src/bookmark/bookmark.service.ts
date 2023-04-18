import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmarkByUser(
    userId: number,
    createBookmarkDto: CreateBookmarkDto,
  ) {
    try {
      const data = {
        ...createBookmarkDto,
        userId,
      };
      console.log({ data });
      const bookmark = await this.prisma.bookmark.create({
        data,
      });
      return bookmark;
    } catch (error) {
      throw new Error(error);
    }
  }

  getBookmarkListByUser(userId: number) {
    try {
      const user = this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      return user.bookmarks();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException(error);
        }
      }
    }
  }

  getBookmarkById(id: string) {
    return id;
    // const bookmark = this.prisma.bookmark.findUniqueOrThrow({
    //   where: {
    //     id,
    //   },
    // });
    // return bookmark;
  }
}
