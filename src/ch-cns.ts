interface FilterFun<T extends Record<string, string>> {
  (condition: boolean): ChainProps<T>
}

interface MagicKey<T extends Record<string, string>> {
  KEY: Chained<T>
}

type ChainProps<T extends Record<string, string>> = {
  [Key in keyof T]: MagicKey<T>['KEY']
}

type Chained<T extends Record<string, string>> = FilterFun<T> & ChainProps<T>

type ChainingFunction<T extends Record<string, string>> = (arg: ChainProps<T>) => ChainProps<T>

export default function chain<T extends Record<string, string>>(S: T, f: ChainingFunction<T>): string {
  let result: string[] | null = []
  const p = new Proxy(() => 0, {
    get(target: any, name: string) {
      if (!result) {
        throw new Error('Using already terminated chain')
      }
      result.push(S[name])
      return p
    },
    apply(target: () => number, thisArg: any, argArray: any[]): any {
      if (!result) {
        throw new Error('Using already terminated chain')
      }
      if (!argArray[0]) {
        result.pop()
      }
      return p
    }
  }) as any
  if (f(p) !== p) {
    throw new Error('Chaining function should always return chained object')
  }
  const r = result.join(' ')
  result = null
  return r
}
