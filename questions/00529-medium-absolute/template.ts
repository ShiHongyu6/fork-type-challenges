type Absolute<T extends number | string | bigint> =
    `${T}` extends `-${infer abs}` ? `${abs}` : `${T}`