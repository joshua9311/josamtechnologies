import { StorageProvider } from './StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';
import { S3StorageProvider } from './S3StorageProvider';

let instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (instance) return instance;

  const providerType = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

  switch (providerType) {
    case 's3':
      instance = new S3StorageProvider();
      break;
    case 'local':
    default:
      instance = new LocalStorageProvider();
      break;
  }

  return instance;
}
