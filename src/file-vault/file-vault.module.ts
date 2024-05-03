import { Module } from '@nestjs/common';
import { FileVaultService } from './file-vault.service';
import { FileVaultController } from './file-vault.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FileVaultService],
  controllers: [FileVaultController],
})
export class FileVaultModule {}
