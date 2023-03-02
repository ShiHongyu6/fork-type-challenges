## 数组和元组在长度上的区别

- 对于普通数组来说，取它的`length`属性，得到一个`number`类型

- 对于元组来说，取它的`length`属性，会得到一个确切的数字字面量类型

```ts
type stringArray = string[]

type tuple = [string, string]

type lengthOfArray = stringArray['length']
// lengthOfArray = number

type tupleLength = tuple['length']
// tupleLength = 2
```

## 字符串字面量的长度

对于字符串字面量，它也是一个确切的字符串，那是否可以通过`length`属性，获取字符串字面量的长度？

试一下看看：

```ts
type str = 'hello'

type strLength = str['length']
// type strLength = number
```

这样直接去是没办法取到的，只能换一个思路，将字符串字面量转换成字符元组，即，字符串的每一个字符，都作为一个元组的元素，这样，元组的长度就是字符的长度。

### 把字符串字面量转换成字符元组

采用递归的方式实现：

1. 参数
   
   - `Str`：还没有转换成元组的字符串字面量
   
   - `CharTuple`：转换了部分字符的元组
   
   - 即，`Str`和`CharTuple`构成了共同构成了最初的字符串

2- 每一次，都把`Str`的第一个字符`first`拿出来，然后和`CharTuple`拼接成新的元组`[...CharTuple, first]`。递归执行这一步，知道没有`first`。

```ts
type _StringToTuple<Str extends string, CharTuple extends string[] = []> =
    Str extends `${infer first}${infer res}`
    ? _StringToTuple<res, [...CharTuple, first]>
    : CharTuple
```

有了上面这个“函数”，就可一计算字符串字面量的长度了：

```ts
type str = 'hello'
type _StringToTuple<Str extends string, CharTuple extends string[] = []> =
    Str extends `${infer first}${infer res}`
    ? _StringToTuple<res, [...CharTuple, first]>
    : CharTuple

type strLength = _StringToTuple<str>['length']
// type strLength = 5
```

这也是`type-challenges`的一道题目：[length of string](https://github.com/type-challenges/type-challenges/blob/main/questions/00298-medium-length-of-string/README.md)

```ts
type LengthOfString<S extends string, CharTuple extends string[] = []> =
  S extends `${infer first}${infer res}`
  ? LengthOfString<res, [...CharTuple, first]>
  : CharTuple['length']
```


