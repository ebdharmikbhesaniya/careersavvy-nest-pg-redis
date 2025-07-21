/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { S3Client } from '@aws-sdk/client-s3';
import { HttpStatus, Module } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import multerS3 from 'multer-s3';
import { AllConfigType } from 'src/config/variables/config.type';
import { FileEntity } from './entity/file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<AllConfigType>,
      ): MulterModuleOptions => {
        const storages = {
          local: (): ReturnType<typeof diskStorage> =>
            diskStorage({
              destination: './files',
              filename: (
                _req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, filename: string) => void,
              ) => {
                const ext = file.originalname.split('.').pop()?.toLowerCase();
                callback(null, `${randomStringGenerator()}.${ext}`);
              },
            }),

          s3: () => {
            const s3 = new S3Client({
              region: configService.getOrThrow('file.awsS3Region', {
                infer: true,
              }),
              credentials: {
                accessKeyId: configService.getOrThrow('file.accessKeyId', {
                  infer: true,
                }),
                secretAccessKey: configService.getOrThrow(
                  'file.secretAccessKey',
                  {
                    infer: true,
                  },
                ),
              },
            });

            return multerS3({
              s3,
              bucket: configService.getOrThrow('file.awsDefaultS3Bucket', {
                infer: true,
              }),
              acl: 'public-read',
              contentType: multerS3.AUTO_CONTENT_TYPE,
              key: (
                _req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, key: string) => void,
              ) => {
                const ext = file.originalname.split('.').pop()?.toLowerCase();
                callback(null, `${randomStringGenerator()}.${ext}`);
              },
            });
          },
        };

        const driver = configService.getOrThrow<'local' | 's3'>('file.driver', {
          infer: true,
        });

        return {
          storage: storages[driver](),
          limits: {
            fileSize: configService.get<number>('file.maxFileSize', {
              infer: true,
            }),
          },
          fileFilter: (
            _req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, acceptFile: boolean) => void,
          ) => {
            const isValid = /\.(jpg|jpeg|png|gif|pdf|docx)$/i.test(
              file.originalname,
            );

            if (!isValid) {
              const error = new Error('Unsupported file type');
              (error as any).status = HttpStatus.UNPROCESSABLE_ENTITY;
              (error as any).details = {
                file: 'cantUploadFileType',
              };
              return callback(error, false);
            }

            callback(null, true);
          },
        };
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
