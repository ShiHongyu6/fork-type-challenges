type Flatten<Arr extends Array<any>> =
    Arr extends [infer first, ...infer res]
    ? first extends unknown[]
      ? [...Flatten<first>, ...Flatten<res>]
      : [first, ...Flatten<res>]
    : []