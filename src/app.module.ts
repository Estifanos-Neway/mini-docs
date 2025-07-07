import { Module } from '@nestjs/common';
import { DocumentsController } from './documents/documents.controller';
import { DocumentService } from './documents/documents.service';
import { DatabaseService } from './database/database.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DocumentsModule,
  ],
  controllers: [DocumentsController],
  providers: [
    DatabaseService,
    DocumentService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
