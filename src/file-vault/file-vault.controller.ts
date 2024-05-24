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
import { IFileVault } from './interfaces/file-vault.interface';
import { MFile } from './classes/mfile.class';

@Controller('files')
export class FileVaultController {
  constructor(private readonly fileVaultService: FileVaultService) {}

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() files: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<IFileVault[]> {
    const saveArray: MFile[] = [new MFile(files)];
    const newFiles = await this.fileVaultService.filterFiles(saveArray);
    return this.fileVaultService.saveFiles(newFiles, folder);
  }
}
