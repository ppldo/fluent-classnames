type Rec = Record<string, string>

interface FilterFun<T extends Rec> {
  (condition: any): FluentProps<T>
}

interface MagicKey<T extends Rec> {
  KEY: Fluent<T>
}

type FluentProps<T extends Rec> = {
  [Key in keyof T]: MagicKey<T>['KEY']
}

type Fluent<T extends Rec> = FilterFun<T> & FluentProps<T>

export type Selector<T extends Rec> = (arg: FluentProps<T>) => FluentProps<T>

export type CurriedSelector<T extends Rec> = (selector: Selector<T>) => string

export { fcn }

function fcn(selector: Selector<Rec>): string
function fcn<T extends Rec>(classNamesMap: T): CurriedSelector<T>
function fcn<T extends Rec>(classNamesMap: T, selector: Selector<T>): string

function fcn(
  selectorOrCns: Rec | Selector<Rec>,
  selector?: Selector<Rec>
): string | CurriedSelector<Rec> {
  let classNamesMap: Rec | null = null
  let sel: Selector<Rec> | undefined = selector
  if (typeof selectorOrCns === 'object') {
    classNamesMap = selectorOrCns
  } else {
    sel = selectorOrCns
  }

  let result: string[] | null = null
  const p: any = new Proxy(
    (condition: any) => {
      if (!result) {
        throw new Error('Using already terminated fluent object')
      }
      if (!condition) {
        result.pop()
      }
      return p
    },
    {
      get(target: any, name: string) {
        if (!result) {
          throw new Error('Using already terminated fluent object')
        }
        if (classNamesMap) {
          if (!(name in classNamesMap)) {
            throw new Error('Unknown class name: ' + name)
          }
          result.push(classNamesMap[name])
        } else {
          result.push(name)
        }
        return p
      }
    }
  )

  function innerSelector(selector: Selector<Rec>) {
    result = []
    if (selector(p) !== p) {
      throw new Error('Selector function should always return fluent object')
    }
    const r = result.join(' ')
    result = null
    return r
  }

  if (sel) {
    return innerSelector(sel)
  }
  return innerSelector
}
