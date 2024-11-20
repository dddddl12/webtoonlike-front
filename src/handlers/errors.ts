import z from "zod";

export class ExpectedServerError extends Error {
  httpCode: number;
  title: string;
  logError: boolean = true;
  constructor({ title, message, logError, httpCode }: {
    httpCode: number;
    title: string;
    message: string;
    logError?: boolean;
  }) {
    super(message);
    this.httpCode = httpCode;
    this.name = this.constructor.name;
    this.title = title;

    /* 통상적인 사용 시 발생하기 어려운 경우 로그로 기록: 클라이언트 로직 오류를 살피기 위함*/
    this.logError = logError ?? false;
  }
}

// 400
export class BadRequestError extends ExpectedServerError {
  constructor(params: { title: string; message: string; logError?: boolean }) {
    super({ ...params, httpCode: 400 });
  }
}

// 401
export class NotAuthorizedError extends ExpectedServerError {
  constructor(params: { title: string; message: string; logError?: boolean }) {
    super({ ...params, httpCode: 401 });
  }
}
// 403
export class ForbiddenError extends ExpectedServerError {
  constructor(params: { title: string; message: string; logError?: boolean }) {
    super({ ...params, httpCode: 403 });
  }
}
// 404
export class NotFoundError extends ExpectedServerError {
  constructor(params: { title: string; message: string; logError?: boolean }) {
    super({ ...params, httpCode: 404 });
  }
}

// 500 - 이 에러의 디테일은 클라이언트에 노출하지 않고 로그 기록용
export class UnexpectedServerError extends Error {}

// Safe action에서 리턴하는 에러 타입
export const ActionErrorSchema = z.object({
  httpCode: z.number(),
  name: z.string(),
  title: z.string(),
  message: z.string(),
});
export type ActionErrorT = z.infer<typeof ActionErrorSchema>;
