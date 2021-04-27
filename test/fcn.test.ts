import { fcn } from '../src/fcn'

const S = {
  root: 'r',
  active: 'a',
  someClass: 's',
  'dashed-name': 'd'
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
  it('construct simple string', () => {
    expect(fcn(S, s => s.root.active.someClass)).toBe('r a s')
    expect(fcn(S, s => s['dashed-name'].root)).toBe('d r')
  })
  it('retain class with truthy condition', () => {
    expect(fcn(S, s => s.root.active(true).someClass)).toBe('r a s')
    expect(fcn(S, s => s.root.active(1).someClass)).toBe('r a s')
    expect(fcn(S, s => s.root.active({}).someClass)).toBe('r a s')
  })
  it('filter out class with falsy condition', () => {
    expect(fcn(S, s => s.root.active(false).someClass)).toBe('r s')
    expect(fcn(S, s => s.root.active(0).someClass)).toBe('r s')
    expect(fcn(S, s => s.root.active('').someClass)).toBe('r s')
    expect(fcn(S, s => s.root.active(null).someClass)).toBe('r s')
    expect(fcn(S, s => s['dashed-name'](undefined).root)).toBe('r')
  })
})

describe('fluent modules curried', () => {
  it('construct simple string', () => {
    expect(fcn(S)(s => s.root.active.someClass)).toBe('r a s')
  })
  it('retain class with truthy condition', () => {
    expect(fcn(S)(s => s.root.active(true).someClass)).toBe('r a s')
  })
  it('filter out class with falsy condition', () => {
    expect(fcn(S)(s => s.root.active(false).someClass)).toBe('r s')
  })
})

describe('error use cases', () => {
  it('throws on using of already terminated fluent object', () => {
    let r: any
    const t = fcn(s => {
      r = s
      return s.root.active
    })
    expect(t).toBe('root active')
    expect(() => r.someClass).toThrowError('Using already terminated fluent object')
  })
  it('throws when selector does not return fluent object', () => {
    expect(() =>
      fcn(s => {
        s.root.active(false)
        return undefined as any
      })
    ).toThrowError('Selector function should always return fluent object')
  })
  it('throws on modules form with wrong class name', () => {
    expect(() => fcn(S, (s: any) => s.wrong)).toThrowError('Unknown class name: wrong')
  })
})
