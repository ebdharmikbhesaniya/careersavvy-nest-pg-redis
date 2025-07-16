export type AllConfigType = {
  app: AppConfig;
  jwt: JwtConfig;
  pgDatabase: PgDatabaseConfig;
  redisDatabase: RedisDatabaseConfig;
  file: FileConfig;
  // apple: AppleConfig;
  // auth: AuthConfig;
  // facebook: FacebookConfig;
  // google: GoogleConfig;
  // mail: MailConfig;
  // twitter: TwitterConfig;
};

export type AppConfig = {
  nodeEnv: string;
  port: number;
  name: string;
  apiPrefix: string;

  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  fallbackLanguage: string;
  headerLanguage: string;
};

export type PgDatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type RedisDatabaseConfig = {
  host?: string;
  port?: number;
  ttl?: string;
  password?: string;
  user?: string;
};

export type JwtConfig = {
  secret?: string;
  expires?: string;
  refreshSecret?: string;
  refreshExpires?: string;
};

export type FileConfig = {
  driver: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
};

// export type AppleConfig = {
//   appAudience: string[];
// };

// export type AuthConfig = {
//   secret?: string;
//   expires?: string;
//   refreshSecret?: string;
//   refreshExpires?: string;
// };

// export type FacebookConfig = {
//   appId?: string;
//   appSecret?: string;
// };

// export type FileConfig = {
//   driver: string;
//   accessKeyId?: string;
//   secretAccessKey?: string;
//   awsDefaultS3Bucket?: string;
//   awsDefaultS3Url?: string;
//   awsS3Region?: string;
//   maxFileSize: number;
// };

// export type GoogleConfig = {
//   clientId?: string;
//   clientSecret?: string;
// };

// export type MailConfig = {
//   port: number;
//   host?: string;
//   user?: string;
//   password?: string;
//   defaultEmail?: string;
//   defaultName?: string;
//   ignoreTLS: boolean;
//   secure: boolean;
//   requireTLS: boolean;
// };

// export type TwitterConfig = {
//   consumerKey?: string;
//   consumerSecret?: string;
// };
