type space = ' ' | '\n' | '\t'


type TrimLeft<S extends string> =
    S extends `${space}${infer res}`
    ? TrimLeft<res>
    : S
