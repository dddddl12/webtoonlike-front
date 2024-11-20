export class ExpectedError extends Error {
  title: string;
  logError: boolean = true;
  constructor({ title, message, logError }: {
    title: string;
    message: string;
    logError?: boolean;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.title = title;

    /* 통상적인 사용 시 발생하기 어려운 경우 로그로 기록: 클라이언트 로직 오류를 살피기 위함*/
    this.logError = logError ?? false;
  }
}

// 400
export class BadRequestError extends ExpectedError {}
// 401
export class NotAuthorizedError extends ExpectedError {}
// 403
export class ForbiddenError extends ExpectedError {}
// 404
export class NotFoundError extends ExpectedError {}

// 500 - 이 에러의 디테일은 클라이언트에 노출하지 않고 로그 기록용
export class UnexpectedError extends Error {}
