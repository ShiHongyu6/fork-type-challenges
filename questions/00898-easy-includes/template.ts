import { Equal } from "@type-challenges/utils"

export type Includes<T extends readonly any[], U> =
    T extends [infer first, ... infer res]
    ? Equal<first, U> extends true
      ? true
      : Includes<res, U>
    : false