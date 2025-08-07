import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Pour .env si utilisé
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'jochong27'),
        password: configService.get('DB_PASSWORD', 'jochong27'),
        database: configService.get('DB_DATABASE', 'opinion_oasis'),
        autoLoadEntities: true,
        synchronize: true, // à désactiver en production
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
