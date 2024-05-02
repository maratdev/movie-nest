import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileVaultService } from './file-vault.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileVaultController {
  constructor(private readonly fileVaultService: FileVaultService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.fileVaultService.saveFiles([file], folder);
  }
}
