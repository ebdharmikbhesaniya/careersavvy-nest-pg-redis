/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { FilesModule } from '../../files/files.module';
import { MulterModule } from '@nestjs/platform-express'; // ✅ REQUIRED
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';

@Module({
  imports: [
    FilesModule,
    MulterModule,
    TypeOrmModule.forFeature([Resume]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
