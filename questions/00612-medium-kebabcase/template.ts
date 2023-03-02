type isUpperCase<_Char extends string> = 
    Uppercase<_Char> extends Lowercase<_Char> 
    ? false
    : Uppercase<_Char> extends _Char
      ? true
      : false


type _kebabCase<S extends string> = 
    S extends `${infer first}${infer res}`
    ? isUpperCase<first> extends true
      ? `-${Lowercase<first>}${_kebabCase<res>}`
      : `${Lowercase<first>}${_kebabCase<res>}`
    : ''

type KebabCase<S extends string> = 
    S extends `${infer first}${infer res}`
    ? `${Lowercase<first>}${_kebabCase<res>}`
    : ''