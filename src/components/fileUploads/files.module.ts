import { Module } from '@nestjs/common';
import { ImageUploadController } from './files.controller';
import { ImageUploadService } from './files.service';

@Module({
    controllers: [ImageUploadController],
    providers: [ImageUploadService],
    exports: [ImageUploadService],
})
export class ImageUploadModule {}