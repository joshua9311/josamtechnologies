export interface UploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  provider: 'local' | 's3' | 'cloudinary';
}

export interface StorageProvider {
  name: 'local' | 's3' | 'cloudinary';
  upload(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }): Promise<UploadResult>;
  delete(filename: string): Promise<boolean>;
  getUrl(filename: string): string;
}
