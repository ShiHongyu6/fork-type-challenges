type Permutation<T, TUnion = T> =
[TUnion] extends [never]
? []
: T extends any
  ? [T, ...Permutation<MyExclude<TUnion, T>>]
  : []