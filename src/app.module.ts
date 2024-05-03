import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppConfig } from './config/app.config';
import { MongooseConfigService } from './config/mongo.config';
import { AuthModule } from './auth/auth.module';
import { GenreModule } from './genre/genre.module';
import { FileVaultModule } from './file-vault/file-vault.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    AppConfig,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UserModule,
    AuthModule,
    GenreModule,
    FileVaultModule,
    ActorModule,
    MovieModule,
    RatingModule,
  ],
})
export class AppModule {}
