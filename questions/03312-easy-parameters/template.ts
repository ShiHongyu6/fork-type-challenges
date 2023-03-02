type MyParameters<T extends (...args: any[]) => any> = 
    T extends (...arg: infer ArgTuple) => any
      ? ArgTuple
      : never
