import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReqUser } from 'src/auth/decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/dto.bookmark';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('/create')
  createBookmarkByUser(
    @ReqUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmarkByUser(userId, createBookmarkDto);
  }

  @Get('get/bookmarkList')
  getBookmarkListByUser(@ReqUser('id') userId: number) {
    return this.bookmarkService.getBookmarkListByUser(userId);
  }

  @Get('get/bookmark')
  getBookmarkById(@Query('id') id: string) {
    return this.bookmarkService.getBookmarkById(id);
  }
}
