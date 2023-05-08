import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  description?: string;
}

export class UpdateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  title?: string;

  @IsString()
  link?: string;

  @IsString()
  description?: string;
}
