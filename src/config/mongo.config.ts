import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const rawUri = this.configService.get<string>('MONGO_URI') ?? '';
    const uri = rawUri.replace(/^\uFEFF/, '').trim();
    const dbName = (this.configService.get<string>('MONGO_DB') ?? '').trim();

    if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
      throw new Error(
        `Invalid MONGO_URI: expected it to start with "mongodb://" or "mongodb+srv://", got "${uri.slice(0, 20)}..."`,
      );
    }

    return { uri, dbName };
  }
}
