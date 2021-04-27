interface FilterFun<T extends Record<string, string>> {
  (condition: any): FluentProps<T>
}

interface MagicKey<T extends Record<string, string>> {
  KEY: Fluent<T>
}

type FluentProps<T extends Record<string, string>> = {
  [Key in keyof T]: MagicKey<T>['KEY']
}

type Fluent<T extends Record<string, string>> = FilterFun<T> & FluentProps<T>

export type Selector<T extends Record<string, string>> = (arg: FluentProps<T>) => FluentProps<T>

export function fcn<T extends Record<string, string>>(S: T, f: Selector<T>): string {
  let result: string[] | null = []
  const p = new Proxy(() => 0, {
    get(target: any, name: string) {
      if (!result) {
        throw new Error('Using already terminated fluent object')
      }
      result.push(S[name])
      return p
    },
    apply(target: () => number, thisArg: any, argArray: any[]): any {
      if (!result) {
        throw new Error('Using already terminated fluent object')
      }
      if (!argArray[0]) {
        result.pop()
      }
      return p
    }
  }) as any
  if (f(p) !== p) {
    throw new Error('Selector function should always return fluent object')
  }
  const r = result.join(' ')
  result = null
  return r
}
