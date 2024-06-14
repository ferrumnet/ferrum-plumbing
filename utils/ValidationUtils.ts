
export class ValidationError extends Error { }

export class ValidationUtils {
  static notEmpty(obj: any, message: string) {
    if (!obj) {
      throw new ValidationError(message);
    }
  }
  static isTrue(predicate: boolean, message: string) {
    if (!predicate) {
      throw new ValidationError(message);
    }
  }
  static allRequired(v: any) {
    Object.keys(v).forEach(k => {
      ValidationUtils.isTrue(!!v[k], `"${k}" must be provided`);
    })
  }
}

export function panick(msg: string) {
	throw new Error(msg);
}
