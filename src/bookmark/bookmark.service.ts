import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

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
      const bookmark = await this.prisma.bookmark.create({
        data,
      });
      return bookmark;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createBookmarkListByUser(
    userId: number,
    createBookmarkDtoList: CreateBookmarkDto[],
  ) {
    try {
      const data = createBookmarkDtoList.map((item) => {
        return {
          ...item,
          userId,
        };
      });
      const bookmarkList = await this.prisma.bookmark.createMany({
        data,
      });
      return bookmarkList;
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
    const bookmark = this.prisma.bookmark.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return bookmark;
  }

  async updateBookmarkById(dto: UpdateBookmarkDto) {
    const originData = await this.prisma.bookmark.findUniqueOrThrow({
      where: {
        id: dto.id,
      },
    });
    try {
      const updatedBookmark = await this.prisma.bookmark.update({
        where: {
          id: dto.id,
        },
        data: {
          ...originData,
          ...dto,
        },
      });
      return { updatedBookmark };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  deleteBookmarkById(id: string) {
    return this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }

  deleteBookmarkListByUserId(userId: number) {
    return this.prisma.bookmark.deleteMany({
      where: {
        userId,
      },
    });
  }
}
