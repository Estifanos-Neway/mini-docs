import { Module } from '@nestjs/common';
import { DocumentsController } from './documents/documents.controller';
import { DocumentService } from './documents/documents.service';
import { DatabaseService } from './database/database.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [DocumentsController],
  providers: [DatabaseService, DocumentService],
})
export class AppModule {}
