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
import { Auth } from '../auth/decorators/auth.decorator';
import { MFile } from './classes/mfile.class';

@Controller('files')
export class FileVaultController {
  constructor(private readonly fileVaultService: FileVaultService) {}

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const saveArray: MFile[] = [new MFile(file)];
    if (file.mimetype.includes('image')) {
      return this.fileVaultService.saveFiles(saveArray, folder);
    }
  }
}
