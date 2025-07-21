import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { JobResponseType } from 'src/global/types/job.type';

@Injectable()
export class JobsService {
  constructor(private readonly http: HttpService) {}

  async findAll() {
    const requestBody = {
      page: 0,
      limit: 1,
      job_country_code_or: ['US'],
      posted_at_max_age_days: 1,
    };

    const response = await firstValueFrom(
      this.http.post<JobResponseType>('jobs/search', requestBody),
    );

    return response.data;
  }
}
