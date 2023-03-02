// 对于const声明的变量 用typeof取得类型后，得到字面量类型
// const str = '666'
// type t = typeof str
// ( t = '666' )

// Tuplue[number] 可以把一个元组转换成元组内元素的union
// 通过in遍历union

type TupleToObject<T extends readonly (string | number | symbol)[]> = {
    [P in T[number]] : P
}

// const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

// type TupleType = typeof tuple

// type PropUnion = TupleType[number]

