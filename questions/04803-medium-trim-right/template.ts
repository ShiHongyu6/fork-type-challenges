type TrimRight<S extends string> =
    S extends `${infer pre}${space}`
    ? TrimRight<pre>
    : S
