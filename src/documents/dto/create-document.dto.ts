import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
