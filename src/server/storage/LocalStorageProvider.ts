import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageProvider, UploadResult } from './StorageProvider';

export class LocalStorageProvider implements StorageProvider {
  name: 'local' = 'local';
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async upload(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }): Promise<UploadResult> {
    // Sanitize extension and generate collision-safe random name
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const randomName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(this.uploadsDir, randomName);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename: randomName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${randomName}`,
      provider: 'local',
    };
  }

  async delete(filename: string): Promise<boolean> {
    try {
      // Prevent path traversal
      const safeName = path.basename(filename);
      const filePath = path.join(this.uploadsDir, safeName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getUrl(filename: string): string {
    const safeName = path.basename(filename);
    return `/uploads/${safeName}`;
  }
}
