import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
import pdfParse from 'pdf-parse';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
  ) {}

  async parseResume(filePath: string): Promise<Resume> {
    try {
      console.log('🔍 Reading file from path:', filePath);
      const buffer = fs.readFileSync(filePath);
      console.log('✅ File read into buffer');

      const pdfData = await pdfParse(buffer);
      console.log(
        '✅ PDF parsed. First 100 chars:',
        pdfData.text.slice(0, 100),
      );

      const parsed = this.extractData(pdfData.text);
      console.log('✅ Extracted parsed data:', parsed);

      const resume = this.resumeRepo.create({
        ...parsed,
        filePath,
      });
      console.log('✅ Resume entity ready to save:', resume);

      const saved = await this.resumeRepo.save(resume);
      console.log('✅ Resume saved successfully:', saved);
      return saved;
    } catch (error) {
      console.error('❌ Real error in parseResume:', error);
      throw new Error('Failed to parse and save resume.');
    }
  }

  private extractData(text: string): Partial<Resume> {
    const data: Partial<Resume> = {};

    const emailMatch = text.match(
      /[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-z]{2,}/,
    );
    data.email = emailMatch ? emailMatch[0] : undefined;

    const phoneMatch = text.match(/(?:\+91[-\s]?|0)?[6-9]\d{4}[\s-]?\d{5}/);
    data.phone = phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : undefined;

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const possibleNames = lines.filter(
      (line) =>
        line.length < 50 &&
        !line.includes('@') &&
        !line.match(/\d/) &&
        /^[A-Z\s]+$/.test(line),
    );

    data.name = possibleNames.length > 0 ? possibleNames[0] : undefined;

    const skillsList = [
      'JavaScript',
      'React',
      'Node.js',
      'NestJS',
      'MongoDB',
      'HTML',
      'CSS',
    ];
    data.skills = skillsList.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase()),
    );

    return data;
  }
}
