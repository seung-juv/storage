import { registerAs } from '@nestjs/config';
export default registerAs('multer', () => ({
  storage_path: process.env.STORAGE_PATH,
}));
