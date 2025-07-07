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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 201, description: 'Document created successfully.' })
  createDocument(
    @Body() body: CreateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.createDocument(body, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 200, description: 'Document updated successfully.' })
  updateDocument(
    @Param('id') id: string,
    @Body() body: CreateDocumentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.updateDocument(id, body, user);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully.' })
  getDocument(@Param('id') id: string) {
    return this.documentsService.getDocument(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for the user' })
  @ApiResponse({ status: 200, description: 'List of documents.' })
  getAllDocuments(@CurrentUser() user: AuthUser) {
    return this.documentsService.getAllDocuments(user);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Document deleted successfully.' })
  deleteDocument(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.deleteDocument(id, user);
  }
}
