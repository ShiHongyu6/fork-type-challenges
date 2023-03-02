type MyReadonly2<T extends object, K extends keyof T = keyof T> = {
    readonly [key in K]: T[key]
} & MyOmit<T, K>
