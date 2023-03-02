# 类型编程：Mapped Type & in

先来了解一下`Mapped Type`，这个类型允许我们指定一个**对象**的键和值的类型。举个例子，如果想要声明一个`Obj`类型，它的键的类型为`string`，值的类型为`any`，则可以像下面这样声明：

```ts
type Obj = {
    [key: string]: any
}
```

除了上面这种粗粒度的控制外，还可以有更细粒度的控制：通过`in`展开`Union`。

## 通过in展开Union

```ts
type propsKey = 'name' | 'age' | 'sex';

type Person = {
  [key in propsKey]: string | number;
}

// 展开后
// type Person = {
//    name: string | number;
//    age : string | number;
//    sex : string | number;
//}
```

可以看到，可以通过`in`关键字，把`Union`各自拆开，然后每个`Union`中的元素都应用“`:`”后的类型。

对于上面这个例子，还有一些问题，`age`应该是一个`number`、`name`和`sex`应该是`string`类型，我们可以通过条件类型来实现这种差异化：

```ts
type propsKey = 'name' | 'age' | 'sex';

type Person = {
  [key in propsKey]:
    key extends 'name' | 'sex'
    ? string
    : number
}

// key用union展开，应用“:”后面的类型
// type Person = {
//    name: 'name' extends 'name' | 'sex' ? string : number
//    age : 'age' extends 'name' | 'sex' ? string : number
//    sex : 'sex' extends 'name' | 'sex' ? string : number
//}
```

好的，了解了怎么展开`Union`，可以通过一个`type-challenges`中的一个例子（[Pick]([type-challenges/README.md at main · type-challenges/type-challenges (github.com)](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md))）来练习巩固一下：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

可以看到，`MyPick`接收两个“参数”，分别是一个对象的类型，以及要“挑”出来的`key`的`Union`，因此，我们就可以先把定义参数：

```ts
// 首先要限制T的类型为object
// 然后再限制keyUnion的类型为keyof T的子类型，防止传入不属于T的key
type MyPick<T extends object, keyUnion extends keyof T>
```

因为挑出来的`key`都已经给了，所以直接展开`keyUnion`即可：

```ts
type MyPick<T extends object, keyUnion extends keyof T> = {
    [key in keyUnion]: T[key]
}
```

### 展开时，never不能用来删除属性

在做类型编程时，我们经常用`never`来删除`Union`中的某一个类型，举个例子：[Exclude](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md)

```ts
type MyExclude<T, U> = T extends U ? never : T
```

但是，我们没办法使用这种方式删除对象类型中的某一个属性，例如，我们想实现[Omit](https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md)

```ts
type MyOmit<T extends object, K extends keyof T> = {
    [key in keyof T]: key extends K ? never : T[key]
}
```

我们这样做并没有删除`K`这个`Union`指定的属性，而是将它们指定为`never`，这是因为，`in`的行为就像我们一直强调的：**展开**

举个例子：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type t = MyOmit<Todo, 'description'>
// 展开
// type t = {
//    title: 'title' extends 'description' ? never : Todo['title']
//         ===> title: Todo['title'] ===> title:string
//    description: 'description' extends 'description' ? never : Todo['description']
//         ===> description: never
//    completed: 'completed' extends 'description' ? never : Todo['completed']
//         ===> completed: Todo['completed'] ===> title:boolean
// }

// 最终结果
// type t =  {
//    title: string
//    description: never
//    completed: boolean
// }
```

## keyof操作符：得到对象类型的所有key组成的Union

在一些情况下，我们需要得到一个对象类型的所有`key`组成的`Union`，这时，我们就可以使用`keyof`操作符。如下：

```ts
interface Person {
    name: string;
    age : number;
}

type PersonKeysUnion = keyof Person
// type PersonKeysUnion = 'name' | 'age'
```

对于`keyof`的使用场景，还是用过一道题目练习：

比如在`type-challenges`中有一道题目[Readonly](https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.md)

```ts
interface Person {
    name: string;
    age : number;
}


type ReadonlyPerson = MyReadonly<Person>
// 想要实现的结果就是
//type ReadonlyPerson = {
//    readonly name: string;
//    readonly age : number;
//}
```

对于这个例子来说，我们很容易想到的就是展开`Person`中的每一个属性时，通过`readonly`修饰它。

还是原来的配方，先想清楚`MyReadonly`的参数，它得是一个对象，所以先限定参数类型：

```ts
type Readonly<T extends object>
```

然后，通过`keyof`获取`T`的`key Union`，然后再展开这个`key Union`，同时指定`readonly`：

```ts
type Readonly<T extends object> = {
    readonly [key in keyof T]: T[key]
} 
```

### keyof还可以用来取元组的index

```ts
type tuple = [1, '2', true]

type ReadonlyTuple<Tuple extends any[]> = {
  readonly [index in keyof Tuple]: Tuple[index]
}

type r = ReadonlyTuple<tuple>
// type r = readonly [1, '2', true]
```

当然，上面的`ReadonlyTuple`还有更简单的实现：

```ts
type ReadonlyTuple<Tuple extends any[]> = readonly [...Tuple]
```

## Tuple[number]：得到元组的元素组成的Union

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type TupleType = typeof tuple;
// readonly ['tesla', 'model 3', 'model X', 'model Y']

type tuplePropsUnion = TupleType[number]; 
// 'tesla' | 'model 3' | 'model X' | 'model Y'
```

有了这个`Union`，我们又可以把它展开成一个对象类型了，还是通过题目[TupleToObject](https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.md)

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple>
// expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

我们仍然先从参数入手，`TupleToObject`接收一个元组类型作为参数：

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type TupleType = typeof tuple
// readonly ['tesla', 'model 3', 'model X', 'model Y'] 
```

并且，这个元组中的元素需要作为一个对象类型的`key`，也就是说，元组中的元素只能是`number`、`string`或者`symbol`；其次，对于元组的类型，是只读的，我们需要使用`readoly`修饰，对于上述两点要求，需要使用`extends`限制一下类型：

```ts
type TupleToObject<T extends (number | string | symbol)[]>
```

记下来就像我们上边讲的，展开`T[number]`即可：

```ts
type TupleToObject<T extends readonly (number | string | symbol)[]> = {
    [key in T[number]] : key
}
```

## 总结

主要是介绍了使用`in`把一个`Union`展开成一个对象类型。同时介绍了`keyof`和`Tuple[number]`，分别用来处理对象类型和元组。