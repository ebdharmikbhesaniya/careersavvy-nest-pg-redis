import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResumeService } from './resume.service';
import { Express } from 'express';
import * as fs from 'fs';

@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/app/resume/uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDFs allowed'), false);
        }
      },
    }),
  )
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('📦 Uploaded file:', file);

      if (!file?.path) {
        throw new Error('No file uploaded.');
      }

      const result = await this.resumeService.parseResume(file.path);
      return {
        message: 'Resume uploaded and parsed successfully.',
        data: result,
      };
    } catch (error) {
      console.error('❌ Error in uploadResume:', error);
      return {
        message: 'Internal server error while processing resume.',
        error: error.message,
      };
    }
  }
}
