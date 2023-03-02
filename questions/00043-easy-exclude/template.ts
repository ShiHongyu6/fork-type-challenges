// T是一个Union
// U是一个Union

type MyExclude<T, U> = T extends U ? never : T
