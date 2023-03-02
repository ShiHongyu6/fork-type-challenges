type AppendArgument<Fn extends (...arg: any) => unknown, A> =
    Fn extends (...arg: infer Args) => infer Ret
    ? (...arg: [...Args, A]) => Ret
    : Fn
