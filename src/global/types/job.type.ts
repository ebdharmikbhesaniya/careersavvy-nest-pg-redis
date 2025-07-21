export interface JobResponseType {
  metadata: MetadataType;
  data: JobType[];
}

export interface MetadataType {
  total_results?: string;
  truncated_results?: number;
  truncated_companies?: number;
  total_companies?: string;
}

export interface JobType {
  id: number;
  job_title: string;
  url: string;
  date_posted: string;
  has_blurred_data: boolean;
  company: string;
  final_url: string | null;
  source_url: string;
  location: string;
  short_location: string;
  long_location: string;
  state_code: string;
  latitude: number;
  longitude: number;
  postal_code: string | null;
  remote: boolean;
  hybrid: boolean;
  salary_string: string;
  min_annual_salary: number | null;
  min_annual_salary_usd: number | null;
  max_annual_salary: number | null;
  max_annual_salary_usd: number | null;
  avg_annual_salary_usd: number | null;
  salary_currency: string;
  countries: string[];
  country: string;
  cities: string[];
  continents: string[];
  seniority: string;
  country_codes: string[];
  country_code: string;
  discovered_at: string;
  company_domain: string;
  hiring_team: HiringTeamType[];
  reposted: boolean;
  date_reposted: string | null;
  employment_statuses: string[];
  easy_apply: boolean;
  keyword_slugs: string[];
  description: string;
  company_object: CompanyObjectType;
  normalized_title: string;
  manager_roles: string[];
  matching_phrases: string[];
  matching_words: string[];
}

export interface HiringTeamType {
  first_name: string;
  full_name: string;
  linkedin_url: string;
  role: string;
  image_url: string;
  thumbnail_url: string;
}

export interface CompanyObjectType {
  name: string;
  domain: string;
  industry: string;
  country: string;
  country_code: string;
  employee_count: number;
  logo: string;
  num_jobs: number;
  num_technologies: number;
  possible_domains: string[];
  url: string;
  industry_id: number;
  linkedin_url: string;
  num_jobs_last_30_days: number;
  num_jobs_found: number | null;
  yc_batch: string | null;
  apollo_id: string;
  linkedin_id: string;
  is_recruiting_agency: boolean;
  id: string;
  founded_year: number;
  annual_revenue_usd: number;
  annual_revenue_usd_readable: string;
  total_funding_usd: number | null;
  last_funding_round_date: string | null;
  last_funding_round_amount_readable: string | null;
  employee_count_range: string;
  long_description: string;
  seo_description: string;
  city: string;
  postal_code: string;
  company_keywords: string[];
  alexa_ranking: number;
  publicly_traded_symbol: string | null;
  publicly_traded_exchange: string | null;
  investors: any[];
  funding_stage: string | null;
  has_blurred_data: boolean;
  technology_slugs: string[];
  technology_names: string[];
}
