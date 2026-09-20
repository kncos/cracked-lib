// ---------- CrackedError

export type CrackedErrorCode =
  | "API_INTERNAL_ERROR"
  | "CONFIG_ERROR"
  | "SYSTEM_ERROR"
  | "PARSE_ERROR"
  | "OTHER";

export class CrackedError extends Error {
  public override readonly name = "CrackedError" as const;
  constructor(
    public readonly code: CrackedErrorCode,
    opts?: {
      message?: string;
      cause?: unknown;
    },
  ) {
    const { message = `CrackedError: ${code}`, cause } = opts || {};
    super(message, { cause });
  }

  get prettyString() {
    return `${this.name} (${this.code}): ${this.message}`;
  }
}

export function isCrackedError(e: unknown): e is CrackedError {
  return e instanceof CrackedError;
}

// ---------- type helpers

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonEmptyArrayOf<T> = [T, ...T[]];

export type MakeKeyOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

export type Nullish<T> = T | null | undefined;

export type HasSameKeys<A, B> = [keyof A] extends [keyof B]
  ? [keyof B] extends [keyof A]
    ? true
    : false
  : false;

// ---------- type guards

export function isNonEmptyArray<T>(v: T[]): v is [T, ...T[]];
export function isNonEmptyArray<T>(v: unknown): v is [T, ...T[]];
export function isNonEmptyArray(v: unknown): boolean {
  return Array.isArray(v) && v.length > 0;
}

export function isNullish(v: unknown): v is null | undefined {
  return v === null || v === undefined;
}

export function isNonNullish<T>(v: T): v is NonNullable<T> {
  return v !== null && v !== undefined;
}

// ---------- try catch

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export function tryCatchSync<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    return { data: fn(), error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

// ---------- random utils

export const getStartOfCurrentUTCYear = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
};

export const getCurrentUTCYearNum = () => new Date().getUTCFullYear();

export function nullsToUndefined<T extends Record<string, any>>(
  obj: T,
): {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K];
} {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = value === null ? undefined : value;
  }

  return result;
}

export function removeKeysFromObj<
  T extends object,
  K extends readonly (keyof T & string)[],
>(obj: T, keys: K): Omit<T, K[number]> {
  const keySet = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keySet.has(k as keyof T & string)),
  ) as Omit<T, K[number]>;
}

export function safeArrayAvg(v: number[]): number | null {
  if (!isNonEmptyArray(v)) return null;

  return v.reduce((sum, curItem) => sum + curItem, 0) / v.length;
}

export const indentStr = (
  str: string,
  count: number = 1,
  indent: string = "  ",
) => {
  const _indent = indent.repeat(count);
  return str.replace(/^/gm, _indent);
};

// ---------- unix signals

export const exitCodeSignalMapping = {
  129: "SIGHUP",
  130: "SIGINT",
  131: "SIGQUIT",
  132: "SIGILL",
  133: "SIGTRAP",
  134: "SIGABRT",
  135: "SIGBUS",
  136: "SIGFPE",
  137: "SIGKILL",
  138: "SIGUSR1",
  139: "SIGSEGV",
  140: "SIGUSR2",
  141: "SIGPIPE",
  142: "SIGALRM",
  143: "SIGTERM",
  144: "SIGSTKFLT",
  145: "SIGCHLD",
  146: "SIGCONT",
  147: "SIGSTOP",
  148: "SIGTSTP",
  149: "SIGTTIN",
  150: "SIGTTOU",
  151: "SIGURG",
  152: "SIGXCPU",
  153: "SIGXFSZ",
  154: "SIGVTALRM",
  155: "SIGPROF",
  156: "SIGWINCH",
  157: "SIGIO",
  158: "SIGPWR",
  159: "SIGSYS",
} as const;

export const signalCodeMapping = {
  1: "SIGHUP",
  2: "SIGINT",
  3: "SIGQUIT",
  4: "SIGILL",
  5: "SIGTRAP",
  6: "SIGABRT",
  7: "SIGBUS",
  8: "SIGFPE",
  9: "SIGKILL",
  10: "SIGUSR1",
  11: "SIGSEGV",
  12: "SIGUSR2",
  13: "SIGPIPE",
  14: "SIGALRM",
  15: "SIGTERM",
  16: "SIGSTKFLT",
  17: "SIGCHLD",
  18: "SIGCONT",
  19: "SIGSTOP",
  20: "SIGTSTP",
  21: "SIGTTIN",
  22: "SIGTTOU",
  23: "SIGURG",
  24: "SIGXCPU",
  25: "SIGXFSZ",
  26: "SIGVTALRM",
  27: "SIGPROF",
  28: "SIGWINCH",
  29: "SIGIO",
  30: "SIGPWR",
  31: "SIGSYS",
} as const;

export type ExitCode = keyof typeof exitCodeSignalMapping;
export type SignalCode = keyof typeof signalCodeMapping;
export type SignalName = (typeof signalCodeMapping)[SignalCode];
