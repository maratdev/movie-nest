import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppConfig } from './config/app.config';
import { MongooseConfigService } from './config/mongo.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AppConfig,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
