/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

const knownSkills = [
  'javascript',
  'html',
  'css',
  'react',
  'node.js',
  'express',
  'mongodb',
  'mysql',
  'c',
  'c++',
  'python',
  'java',
  'typescript',
  'php',
  'angular',
  'vue',
  'bootstrap',
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of knownSkills) {
    const escaped = escapeRegex(skill.toLowerCase());

    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`,
      'i'
    );

    if (pattern.test(lowerText)) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills.map((s) => s.trim()))];
}

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}

  async parseResume(file: Express.Multer.File): Promise<Resume> {
    try {
      const buffer = fs.readFileSync(file.path);
      const data = await pdfParse(buffer) as pdfParse.PDFParseResult;
      const text = typeof (data as pdfParse.PDFParseResult).text === 'string' ? (data as pdfParse.PDFParseResult).text : '';

      const name = this.extractName(text);
      const email = this.extractEmail(text);
      const phone = this.extractPhone(text);
      const skills = extractSkills(text);

      const savedPath = this.saveFile(file);

      const resume = this.resumeRepository.create({
        name,
        email,
        phone,
        skills,
        filePath: savedPath,
        submittedAt: new Date(),
      });

      return await this.resumeRepository.save(resume);
    } catch (err) {
      this.logger.error('❌ Resume parsing failed:', err);
      throw new InternalServerErrorException('Resume parsing failed');
    }
  }

  private saveFile(file: Express.Multer.File): string {
    const fileName = `${uuidv4()}_${file.originalname}`;
    const outputPath = path.join(__dirname, '../../files/', fileName);
    fs.copyFileSync(file.path, outputPath);
    return outputPath;
  }

  private extractName(text: string): string {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    // Skip job titles or headings like "Web Development Intern"
    const blacklist = [
      'intern',
      'developer',
      'engineer',
      'summary',
      'profile',
      'experience',
    ];

    const nameRegex = /^[A-Z][a-zA-Z]*(\s[A-Z][a-zA-Z]*){0,3}$/;

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (blacklist.some((word) => lower.includes(word))) continue;
      if (nameRegex.test(line)) {
        return line;
      }
    }

    return 'Unknown';
  }

  private extractEmail(text: string): string {
    // 1. Match emails even if extra junk is stuck after them (e.g., Bhesan)
    const emailRegex = /[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);

    if (!matches || matches.length === 0) return '';

    // 2. Remove numbers before email if accidentally stuck (like 91994prajapti@...)
    let cleanEmail = matches[0].replace(/^(\d{5,})([a-zA-Z0-9._%+-]+@)/, '$2');

    // 3. Just in case extra word is merged, cut off at .com/.in/etc.
    const domainMatch = cleanEmail.match(/^[^\s]+(\.com|\.in|\.org|\.net)/);
    if (domainMatch) {
      const endIndex =
        cleanEmail.indexOf(domainMatch[1]) + domainMatch[1].length;
      cleanEmail = cleanEmail.slice(0, endIndex);
    }

    return cleanEmail;
  }

  private extractPhone(text: string): string {
    const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{3,5}\)?[\s-]?)?\d{5,10}/g;
    const matches = text.match(phoneRegex);
    if (!matches) return '';

    const clean = matches
      .map((num) => num.replace(/[^\d]/g, ''))
      .find((num) => num.length >= 10 && num.length <= 13);
    return clean || '';
  }
}
