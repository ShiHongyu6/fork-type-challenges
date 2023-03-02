type MyReturnType<T extends (...arg: any) => unknown> = T extends (...arg: any) => infer U ? U : never
