type ReplaceAll<S extends string, From extends string, To extends string> =
    From extends ''
    ? S
    : S extends `${infer pre}${From}${infer res}`
      ? `${pre}${To}${ReplaceAll<res, From, To>}`
      : S
