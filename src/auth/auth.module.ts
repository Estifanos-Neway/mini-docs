import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
  ],
  providers: [DatabaseService, AuthGuard],
  controllers: [],
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
