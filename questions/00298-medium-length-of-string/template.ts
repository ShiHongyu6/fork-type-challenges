export type LengthOfString<S extends string, CharList extends string[] = []> =
    S extends `${infer first}${infer res}`
    ? LengthOfString<res, [...CharList, first]>
    : CharList['length']