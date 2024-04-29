import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigAppModule } from './config/config-app.module';
import { MongooseConfigService } from './config/mongo.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigAppModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
