import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { FilesService } from '../../files/files.service'; // ✅ Correct import
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { diskStorage } from 'multer';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (_req, file, cb) => {
          const ext = file.originalname.split('.').pop()?.toLowerCase();
          cb(null, `${randomStringGenerator()}.${ext}`);
        },
      }),
    }),
  )
  async parseResume(@UploadedFile() file: Express.Multer.File) {
    console.log('📄 FILE DEBUG:', file); // Log full object
    return await this.resumeService.parseResume(file);
  }
}
