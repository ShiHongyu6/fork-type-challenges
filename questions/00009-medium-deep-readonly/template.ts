type DeepReadonly<T extends object> = {
    readonly [key in keyof T]:
        T[key] extends object
        ? T[key] extends (...arg: any) => any
          ? T[key]
          : DeepReadonly<T[key]>
        : T[key]
}

