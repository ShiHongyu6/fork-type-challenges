type Replace<S extends string, From extends string, To extends string> =
    From extends ''
    ? S
    : S extends `${infer left}${From}${infer right}`
      ? `${left}${To}${right}`
      : S