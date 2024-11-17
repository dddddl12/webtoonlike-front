export class ExpectedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotSignedInError extends ExpectedError {}
export class SignUpIncompleteError extends ExpectedError {}
export class WrongUserTypeError extends ExpectedError {}
export class NotAuthorized extends ExpectedError {}
export class InsufficientPermissions extends ExpectedError {}
export class NotFound extends ExpectedError {}
export class ForeignKeyError extends ExpectedError {}
