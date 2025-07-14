export class CommonResponse<T> {
  constructor(
    public data?: T,
    public message: string = 'Success',
    public code: string = '200',
    public status: boolean = true,
    public timestamp: string = new Date().toISOString(),
    public path?: string,
  ) {}
}

// export class CommonResponse<T> {
//   public data?: T;
//   public message: string;
//   public code: string;
//   public status: boolean;
//   public timestamp?: string = new Date().toISOString();
//   public path?: string;

//   constructor(
//     data?: T,
//     message: string = 'Success',
//     code: string = '200',
//     status: boolean = true,
//     path?: string,
//   ) {
//     this.data = data;
//     this.message = message;
//     this.code = code;
//     this.status = status;
//     this.path = path;
//     this.timestamp = new Date().toISOString();
//   }
// }
