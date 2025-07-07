import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentService } from './documents.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentService, DatabaseService],
  exports: [DocumentService],
})
export class DocumentsModule {}
