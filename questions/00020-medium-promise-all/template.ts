declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<{
    [index in keyof T]: Awaited<T[index]>
}>
