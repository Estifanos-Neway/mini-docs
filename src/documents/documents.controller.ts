import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/interfaces/auth-user.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentService) {}

  @Post()
  createDocument(
    @Body(ValidationPipe) body: CreateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.createDocument(body, user);
  }

  @Put(':id')
  updateDocument(
    @Param('id') id: string,
    @Body(ValidationPipe) body: CreateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.updateDocument(id, body, user);
  }

  @Get(':id')
  getDocument(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.getDocument(id, user);
  }

  @Get()
  getAllDocuments(@CurrentUser() user: AuthUser) {
    return this.documentsService.getAllDocuments(user);
  }

  @Delete(':id')
  deleteDocument(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.deleteDocument(id, user);
  }
}
