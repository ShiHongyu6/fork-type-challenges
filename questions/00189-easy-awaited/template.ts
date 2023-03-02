type Thenable<T> = {
    then: (onfulfilled: (arg: T) => any) => any
}

type MyAwaited<T extends Thenable<unknown>> =
    T extends Thenable<infer R>
    ? R extends Thenable<unknown>
        ? MyAwaited<R>
        : R
    : never
