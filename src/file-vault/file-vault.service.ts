import { Inject, Injectable } from '@nestjs/common';
import { IFileVault } from './interfaces/file-vault.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { join } from 'node:path';
import { MFile } from './classes/mfile.class';
import { randomUUID } from 'node:crypto';
import * as sharp from 'sharp';

@Injectable()
export class FileVaultService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  private dateFolder = format(new Date(), 'yyyy/MM/dd');
  private directoryPath = this.config.get('UPLOAD_DIRECTORY');

  private getUploadDirectoryPath(folder): string {
    return join(`${path}/${this.directoryPath}/${folder}`, this.dateFolder);
  }

  async saveFiles(
    files: MFile[],
    folder: string = 'default',
  ): Promise<IFileVault[]> {
    const uploadDirectoryPath = this.getUploadDirectoryPath(folder);
    const filename = randomUUID();

    return await Promise.all(
      files.map(async (file) => {
        const buffer = await this.convertToWebp(file.buffer);
        await ensureDir(uploadDirectoryPath);
        await writeFile(`${uploadDirectoryPath}/${filename}.webp`, buffer);
        return {
          url: `/${this.directoryPath}/${folder}/${this.dateFolder}/${filename}.webp`,
          name: file.originalname,
        };
      }),
    );
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp({ lossless: true }).toBuffer();
  }
}
