type MyCapitalize<S extends string> =
    S extends `${infer first}${infer res}`
    ? `${Uppercase<first>}${res}`
    : S
