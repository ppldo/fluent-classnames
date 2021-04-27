type Rec = Record<string, string>

interface FluentFun<T extends Rec> {
  (condition: any): FluentProps<T>
}

interface RecursiveFluent<T extends Rec> {
  KEY: Fluent<T>
}

type FluentProps<T extends Rec> = {
  [Key in keyof T]: RecursiveFluent<Omit<T, Key>>['KEY']
}

type Fluent<T extends Rec> = FluentFun<T> & FluentProps<T>

export type Selector<T extends Rec> = (arg: FluentProps<T>) => FluentProps<any>

export type CurriedSelector<T extends Rec> = (selector: Selector<T>) => string

interface RecursiveRecord {
  [key: string]: RecursiveRecordFun
}

interface RecursiveRecordFun {
  (condition: any): RecursiveRecord
  [key: string]: RecursiveRecordFun
}

type DynamicSelector = (arg: RecursiveRecord) => RecursiveRecord

export { fcn }

function fcn(selector: DynamicSelector): string
function fcn<T extends Rec>(classNamesMap: T): CurriedSelector<T>
function fcn<T extends Rec>(classNamesMap: T, selector: Selector<T>): string

function fcn(
  selectorOrCns: Rec | DynamicSelector,
  selector?: Selector<Rec>
): string | CurriedSelector<Rec> {
  let classNamesMap: Rec | null = null
  let sel: Selector<Rec> | DynamicSelector | undefined = selector
  if (typeof selectorOrCns === 'object') {
    classNamesMap = selectorOrCns
  } else {
    sel = selectorOrCns
  }

  let result: string[] | null = null

  let p: any

  const filterFn = (condition: any) => {
    if (!result) {
      throw new Error('Using already terminated fluent object')
    }
    if (!condition) {
      result.pop()
    }
    return p
  }

  const addFn = (name: string) => {
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

  if (typeof Proxy !== 'undefined') {
    p = new Proxy(filterFn, { get: (_, name: string) => addFn(name) })
  } else if (classNamesMap) {
    p = filterFn
    for (const key in classNamesMap) {
      if (classNamesMap.hasOwnProperty(key)) {
        Object.defineProperty(p, key, { get: () => addFn(key) })
      }
    }
  } else {
    throw new Error('Cannot use fluent global class names without proxy')
  }

  function innerSelector(selector: Selector<Rec> | DynamicSelector) {
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
