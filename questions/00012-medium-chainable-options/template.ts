interface Chainable<Options extends object = {}> {
  option<
    KeyType extends string,
    ValType extends any
  >
    (
      key: KeyType extends keyof Options ? never : KeyType,
      value: ValType
    ):
    Chainable<
      (
        KeyType extends keyof Options
        ? MyOmit<Options, KeyType>
        : Options
      ) & {
        [props in KeyType]: ValType
      }
    >

  get(): Options
}