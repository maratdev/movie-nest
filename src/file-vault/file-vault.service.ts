import { Injectable } from '@nestjs/common';
import { IFileVault } from './interfaces/file-vault.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileVaultService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<IFileVault[]> {
    const uploadedFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadedFolder);

    return await Promise.all(
      files.map(async (file) => {
        await writeFile(`${uploadedFolder}/${file.originalname}`, file.buffer);
        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );
  }
}
