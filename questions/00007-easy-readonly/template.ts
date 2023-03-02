type MyReadonly<T extends object> = {
    readonly [Props in keyof T]: T[Props]
}
