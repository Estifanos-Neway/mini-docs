export enum ResponseReason {
  OK = 'OK',
}

export interface CommonResponse<T = any> {
  reason: ResponseReason;
  data?: T;
}
