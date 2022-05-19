import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadController } from './files.controller';

describe('ImageUpload Controller', () => {
  let controller: ImageUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageUploadController],
    }).compile();

    controller = module.get<ImageUploadController>(ImageUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});