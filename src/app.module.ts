import { Module } from '@nestjs/common';
import { DocumentsController } from './documents/documents.controller';
import { DocumentService } from './documents/documents.service';
import { DatabaseService } from './database/database.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [DocumentsController],
  providers: [DatabaseService, DocumentService],
})
export class AppModule {}
