export class BaseException {
  error;
  constructor(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.error = error;
  }
}
