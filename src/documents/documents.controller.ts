import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DocumentService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser, UserRole } from 'src/interfaces/auth-user.interface';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentService) {}

  @Post()
  createDocument(
    @Body() body: CreateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.createDocument(body, user);
  }

  @Put(':id')
  updateDocument(
    @Param('id') id: string,
    @Body() body: CreateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.updateDocument(id, body, user);
  }

  @Public()
  @Get(':id')
  getDocument(@Param('id') id: string) {
    return this.documentsService.getDocument(id);
  }

  @Get()
  getAllDocuments(@CurrentUser() user: AuthUser) {
    return this.documentsService.getAllDocuments(user);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  deleteDocument(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.deleteDocument(id, user);
  }
}
