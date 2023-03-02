type Diff<T, U, A = T & U> = {
    [key in (Exclude<keyof A, keyof T> | Exclude<keyof A, keyof U>)]: A[key]
}