import { Allow } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'file' })
export class FileEntity {
  //   @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Allow()
  @Column()
  path: string;

  //   @AfterLoad()
  //   @AfterInsert()
  //   updatePath() {
  //     if (this.path.indexOf('/') === 0) {
  //       this.path = (appConfig() as AppConfig).backendDomain + this.path;
  //     }
  //   }
}
