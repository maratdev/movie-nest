import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IFileVault } from './interfaces/file-vault.interface';
import { path } from 'app-root-path';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { join } from 'node:path';
import { MFile } from './classes/mfile.class';
import { randomUUID } from 'node:crypto';
import * as sharp from 'sharp';
import { ensureDir, writeFile } from 'fs-extra';

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

    return await Promise.all(
      files.map(async (file): Promise<IFileVault> => {
        try {
          await ensureDir(uploadDirectoryPath);
          await writeFile(
            join(uploadDirectoryPath, file.originalname),
            file.buffer,
          );
        } catch (err) {
          throw new InternalServerErrorException('Не удалось сохранить файл');
        }
        return {
          url: `/${this.directoryPath}/${folder}/${this.dateFolder}/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp({ lossless: true }).toBuffer();
  }

  async filterFiles(files: MFile[]) {
    return await Promise.all(
      files.map(async (file) => {
        const mimetype = file.mimetype;
        const currentFileType = file.mimetype.split('/')[1];
        const filename = randomUUID();
        const type = file.originalname.split('.')[1];
        if (mimetype.includes('image')) {
          if (currentFileType != 'svg+xml') {
            const buffer = await this.convertToWebp(file.buffer);
            return new MFile({
              buffer,
              originalname: `${filename}.webp`,
              mimetype,
            });
          }
          return new MFile({
            buffer: file.buffer,
            originalname: `${filename}.svg`,
            mimetype,
          });
        }
        return new MFile({
          buffer: file.buffer,
          originalname: `${filename}.${type}`,
          mimetype,
        });
      }),
    );
  }
}
