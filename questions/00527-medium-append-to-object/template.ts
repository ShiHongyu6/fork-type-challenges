type AppendToObject<T extends object, U extends string, V extends any> = {
    [key in (keyof T) | U]:
        key extends keyof T
        ? T[key]
        : V  
}