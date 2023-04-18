import { IsNotEmpty, IsString } from 'class-validator';

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
