import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/auth/decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto/dto.bookmark';
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
  @Post('/createList')
  createBookmarkListByUser(
    @ReqUser('id') userId: number,
    @Body('createBookmarkDtoList') createBookmarkDtoList: CreateBookmarkDto[],
  ) {
    return this.bookmarkService.createBookmarkListByUser(
      userId,
      createBookmarkDtoList,
    );
  }

  @Get('get/bookmarkList')
  getBookmarkListByUser(@ReqUser('id') userId: number) {
    return this.bookmarkService.getBookmarkListByUser(userId);
  }

  @Get('get/single/bookmark')
  getBookmarkById(@Query('id') id: string) {
    return this.bookmarkService.getBookmarkById(id);
  }

  @Post('update/single/bookmark')
  updateBookmarkById(@Body() dto: UpdateBookmarkDto) {
    return this.bookmarkService.updateBookmarkById(dto);
  }

  @Delete('delete/single/bookmark')
  deleteBookmarkById(@Body('id') id: string) {
    return this.bookmarkService.deleteBookmarkById(id);
  }

  @Delete('delete/bookmarkList')
  deleteBookmarkListByUserId(@ReqUser('id') userId: number) {
    return this.bookmarkService.deleteBookmarkListByUserId(userId);
  }
}
