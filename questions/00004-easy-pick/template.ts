// 通过 in 遍历union类型
// 通过keyof将一个interface的key转换成union



type MyPick<T extends object, K extends keyof T> = {
    [PropKey in K] : T[PropKey]
}
