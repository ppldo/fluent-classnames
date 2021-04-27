import { fcn } from '../src/fcn'

const S = {
  root: 'r',
  active: 'a',
  someClass: 's',
  'dashed-name': 'd',
  name: 'n',
  call: 'c',
  apply: 'ap',
  arguments: 'ar'
}

const globalProxy = Proxy

function withoutProxy(fn: () => void) {
  globalThis.Proxy = undefined as any
  try {
    fn()
  } finally {
    globalThis.Proxy = globalProxy
  }
}

function itBoth(text: string, fn: () => void) {
  it.each([true, false])(text + ' (with proxy: %p)', (withProxy: boolean) => {
    if (!withProxy) {
      withoutProxy(fn)
    } else {
      fn()
    }
  })
}

describe('fluent simple', () => {
  it('construct simple string', () => {
    expect(fcn(s => s.root.active.someClass)).toBe('root active someClass')
  })
  it('retain class with truthy condition', () => {
    expect(fcn(s => s.root.active(true).someClass)).toBe('root active someClass')
    expect(fcn(s => s.root.active(1).someClass)).toBe('root active someClass')
    expect(fcn(s => s.root.active({}).someClass)).toBe('root active someClass')
  })
  it('filter out class with falsy condition', () => {
    expect(fcn(s => s.root.active(false).someClass)).toBe('root someClass')
    expect(fcn(s => s.root.active(0).someClass)).toBe('root someClass')
    expect(fcn(s => s.root.active('').someClass)).toBe('root someClass')
    expect(fcn(s => s.root.active(null).someClass)).toBe('root someClass')
  })
})

describe('fluent modules', () => {
  itBoth('construct simple string', () => {
    expect(fcn(S, s => s.root.active.someClass)).toBe('r a s')
    expect(fcn(S, s => s['dashed-name'].root)).toBe('d r')
  })
  itBoth('retain class with truthy condition', () => {
    expect(fcn(S, s => s.root.active(true).someClass)).toBe('r a s')
    expect(fcn(S, s => s.root.active(1).someClass)).toBe('r a s')
    expect(fcn(S, s => s.root.active({}).someClass)).toBe('r a s')
  })
  itBoth('filter out class with falsy condition', () => {
    expect(fcn(S, s => s.root.active(false).someClass)).toBe('r s')
    expect(fcn(S, s => s.root.active(0).someClass)).toBe('r s')
    expect(fcn(S, s => s.root.active('').someClass)).toBe('r s')
    expect(fcn(S, s => s.root.active(null).someClass)).toBe('r s')
    expect(fcn(S, s => s['dashed-name'](undefined).root)).toBe('r')
  })
})

describe('fluent modules curried', () => {
  const s = fcn(S)
  itBoth('construct simple string', () => {
    expect(s(s => s.root.active.someClass)).toBe('r a s')
  })
  itBoth('retain class with truthy condition', () => {
    expect(s(s => s.root.active(true).someClass)).toBe('r a s')
  })
  itBoth('filter out class with falsy condition', () => {
    expect(s(s => s.root.active(false).someClass)).toBe('r s')
  })
})

describe('error use cases', () => {
  itBoth('throws on using of already terminated fluent object', () => {
    let r: any
    const t = fcn(S, s => {
      r = s
      return s.root.active
    })
    expect(t).toBe('r a')
    expect(() => r.someClass).toThrowError('Using already terminated fluent object')
  })
  itBoth('throws when selector does not return fluent object', () => {
    expect(() =>
      fcn(S, s => {
        s.root.active(false)
        return undefined as any
      })
    ).toThrowError('Selector function should always return fluent object')
  })
  it('throws on modules form with wrong class name', () => {
    expect(() => fcn(S, (s: any) => s.wrong)).toThrowError('Unknown class name: wrong')
    withoutProxy(() => {
      expect(() => fcn(S, (s: any) => s.wrong)).toThrowError(
        'Selector function should always return fluent object'
      )
      expect(() => fcn(S, (s: any) => s.wrong())).toThrowError('s.wrong is not a function')
      expect(() => fcn(S, (s: any) => s.wrong.wrong2)).toThrowError(
        "Cannot read property 'wrong2' of undefined"
      )
    })
  })
  it('throws on global form without proxy', () => {
    withoutProxy(() => {
      expect(() => fcn(s => s.root)).toThrowError(
        'Cannot use fluent global class names without proxy'
      )
    })
  })
  itBoth('works with classes, which names interfere with Function properties', () => {
    expect(
      fcn(
        S,
        s =>
          s
            .name(1)
            .call(1)
            .apply(1).arguments
      )
    ).toBe('n c ap ar')
  })
})
