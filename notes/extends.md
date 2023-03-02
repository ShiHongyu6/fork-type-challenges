关于`A extends B`关键字，可以理解成“A类型的值可以赋值给B类型”。它有两处用法：

- 类型约束

- 条件类型

## 在声明泛型时，约束泛型的类型（位于"="左边）

在声明泛型时，大多数情况都会对泛型有一个“范围”限制。举个例子，现在要声明一个函数，它的参数类型是对象类型，但不能是原始类型。

```ts
type Fn<Arg extends object, Ret> = (arg: Arg) => Ret 
```

## 条件类型（位于"="右边）

条件类型（Conditional Types），就是在类型编程中使用的“三元表达式”。拿官方文档中的例子解释一下：

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
// type Example1 = number

type Example2 = RegExp extends Animal ? number : string;     
// type Example2 = string
```

对于`Dog extends Animal ? number : string;`， 回想一下一开始说的对于`extends`的理解，对于"?"之前，可以理解为“`Dog`类型的值可以赋值给`Animal`”，显然，这是对的，因此，`Example1 = number`；同理“`RegExp`类型的值可以赋值给Animal”，显然是错的，所以`Example2 = string`。

### “分布式”条件类型

先举个例子：

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```

从直觉上来说，因为传入的`Type = string | number`，最终，得到的`StrArrOrNumArr = (string | number)[]`。

但是，最后的结果并不是我们想象的结果，这就是所谓的“分布式”（Distributive）。

- 首先，我们可以把一个泛型理解成一个“函数”，类型参数就是这个函数的参数。对于上面的例子，`ToArray`就是一个函数，`Type`就是它的参数列表，“`=`”后面就是这个函数的实现。

- 如果在传参的时候，给`Type`传递了一个`Union`，那么，就会把`Union`中的每一个类型单独拿出来（上面的例子就是`string`和`number`），然后用他们分别“调用泛型函数”，把它们的结果用“`|`”整合起来。

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// 相当于 type StrArrOrNumArr = ToArray<string> | ToArray<number>;
// ==> type StrArrOrNumArr = string[] | number[]
```

我们可以“关闭”这种分布式，来实现我们预想中的结果：

```ts
type ToArray<Type> = [Type] extends any ? Type[] : never;
```

给`extends`左边的`Type`加上了"`[]`"，这就表示，如果`Type`是一个`Union`，则不使用“分布式”。

### Exclude

了解了这些内容之后，一起来愉快的做题吧[Exclude](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md)

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a' | 'b'> // 'c'
```

可以看到，通过第二个参数对第一个参数的`Union`进行“过滤”。这里就可以用到分布式了，对于第一个`Union`的每一个元素，如果可以赋值给第二个元素，就把它“过滤掉”。

```ts
type MyExclude<T, U> = T extends U ? never : T
```

再解释一下：

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a' | 'b'> // 'c'

// 因为T在extends左边，如果使用时，T是一个Union，则会触发分布式
// 又因为，'a' | 'b' | 'c'
// 所以，这里触发了分布式

type Result = MyExclude<'a', 'a' | 'b'> // 'a' extends 'a' | 'b' ? never : 'a' 
                                        // ==> never
            | MyExclude<'b', 'a' | 'b'> // 'b' extends 'a' | 'b' ? never : 'b'
                                        // ==> never
            | MyExclude<'c', 'a' | 'b'> // 'c' extends 'a' | 'b' ? never : 'c'
                                        // ==> 'c'

// type Result = 'c'
```
